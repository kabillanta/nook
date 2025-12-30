import firebase_admin
from firebase_admin import auth, credentials
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from database import SessionLocal, engine
import models
from datetime import datetime
from sqlalchemy import or_
from apscheduler.schedulers.background import BackgroundScheduler 
from contextlib import asynccontextmanager 

models.Base.metadata.create_all(bind=engine)

# 2. Initialize Firebase
# Make sure this file is inside your nook-api folder
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def reaper_job():
    """
    This function runs automatically in the background.
    It creates its own database session, checks for dead commitments,
    marks them as 'broken', and closes the session.
    """
    db = SessionLocal() # Create a fresh DB session
    try:
        now = datetime.utcnow()
        print(f"💀 The Reaper is scanning... (Time: {now})")
        
        # Find expired pending commitments
        expired = db.query(models.Commitment).filter(
            models.Commitment.status == "pending",
            models.Commitment.deadline < now
        ).all()
        
        if expired:
            print(f"💀 The Reaper claimed {len(expired)} souls.")
            for comm in expired:
                comm.status = "broken"
            db.commit()
        else:
            print("💀 No souls to claim.")
            
    except Exception as e:
        print(f"Reaper Error: {e}")
    finally:
        db.close() # Always close the session!
        
        
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    scheduler = BackgroundScheduler()
    scheduler.add_job(reaper_job, 'interval', minutes=1) # Run every 1 minute
    scheduler.start()
    print("--- 💀 THE REAPER IS ONLINE ---")
    
    yield # The app runs here
    
    # Shutdown
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

# 3. Add CORS Middleware (CRITICAL for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Input Schema
class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str

class CommitmentCreate(BaseModel):
    user_id: str 
    text: str
    deadline: str
    
    
class CompletionRequest(BaseModel):
    user_id: str
    proof: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    # --- PHASE 1: PRE-CHECK (Database) ---
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Handle already claimed.")
    
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    # --- PHASE 2: CREATE IN FIREBASE ---
    try:
        user_record = auth.create_user(
            email=data.email,
            password=data.password,
            display_name=data.username
        )
        firebase_uid = user_record.uid
        
    except firebase_admin.auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already used in Firebase.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firebase Error: {str(e)}")

    # --- PHASE 3: STORE IN POSTGRES ---
    try:
        new_user = models.User(
            id=firebase_uid, 
            username=data.username, 
            email=data.email
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"status": "success", "username": new_user.username}
        
    except Exception as e:
        # Rollback: Delete the ghost user from Firebase
        auth.delete_user(firebase_uid)
        raise HTTPException(status_code=500, detail="Database Error. Registration rolled back.")
    
    
@app.post("/commitments")
def create_commitment(data: CommitmentCreate, db: Session = Depends(get_db)):
    # Create the record
    new_comm = models.Commitment(
        text=data.text,
        deadline=data.deadline, # SQLAlchemy parses ISO strings automatically
        user_id=data.user_id,
        status="pending"
    )
    db.add(new_comm)
    db.commit()
    db.refresh(new_comm)
    return {"status": "created", "id": new_comm.id}


@app.get("/feed")
def get_feed(db: Session = Depends(get_db)):
    # Fetch all commitments, newest first, and JOIN with User table
    results = db.query(models.Commitment)\
        .options(joinedload(models.Commitment.owner))\
        .order_by(models.Commitment.created_at.desc())\
        .limit(50)\
        .all()
    
    return results

@app.get("/users/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    commitments = db.query(models.Commitment)\
        .options(joinedload(models.Commitment.owner))\
        .filter(models.Commitment.user_id == user.id)\
        .order_by(models.Commitment.created_at.desc())\
        .all()
    
    total = len(commitments)
    kept = sum(1 for c in commitments if c.status == 'kept')
    
    return {
        "profile": {
            "username": user.username,
            "joined_at": user.created_at,
            "stats": {"total": total, "kept": kept}
        },
        "commitments": commitments
    }    
    
@app.get("/users/id/{uid}")
def get_user_by_uid(uid: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user.username, "email": user.email}


@app.put("/commitments/{id}/complete")
def mark_commitment_complete(id: int, data: CompletionRequest, db: Session = Depends(get_db)):
    # 1. Find the commitment
    comm = db.query(models.Commitment).filter(models.Commitment.id == id).first()
    
    if not comm:
        raise HTTPException(status_code=404, detail="Commitment not found")

    # 2. Security Check: Is this YOUR commitment?
    if comm.user_id != data.user_id:
        raise HTTPException(status_code=403, detail="You cannot complete someone else's commitment.")

    # 3. Rule Check: Is it already finished?
    if comm.status != "pending":
        raise HTTPException(status_code=400, detail=f"This commitment is already {comm.status}.")

    # 4. The Reaper Check: Is it too late?
    # We compare the current UTC time with the deadline
    if datetime.utcnow() > comm.deadline.replace(tzinfo=None):
        comm.status = "broken" # It's actually failed
        db.commit()
        raise HTTPException(status_code=400, detail="The deadline has passed. The Reaper has claimed this.")

    # 5. Success: Mark as Kept
    comm.status = "kept"
    # We could save the 'proof' text here if we added a column for it
    db.commit()
    
    return {"status": "kept"}

@app.post("/commitments/{id}/witness")
def witness_commitment(id: int, db: Session = Depends(get_db)):
    # 1. Find the commitment
    comm = db.query(models.Commitment).filter(models.Commitment.id == id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commitment not found")
    
    # 2. Increment the counter
    comm.witness_count += 1
    db.commit()
    
    return {"status": "witnessed", "new_count": comm.witness_count}


@app.get("/explore")
def get_explore_feed(db: Session = Depends(get_db)):
    # Fetch top 50 commitments ordered by witness_count (Highest first)
    results = db.query(models.Commitment)\
        .options(joinedload(models.Commitment.owner))\
        .order_by(models.Commitment.witness_count.desc())\
        .limit(50)\
        .all()
    
    return results

@app.get("/search")
def search_ledger(q: str, db: Session = Depends(get_db)):
    if not q:
        return {"users": [], "commitments": []}

    search_term = f"%{q}%" # SQL wildcard for "contains"

    # 1. Search Users
    users = db.query(models.User).filter(
        models.User.username.ilike(search_term) # ilike = case insensitive
    ).limit(5).all()

    # 2. Search Commitments
    commitments = db.query(models.Commitment)\
        .options(joinedload(models.Commitment.owner))\
        .filter(models.Commitment.text.ilike(search_term))\
        .order_by(models.Commitment.witness_count.desc())\
        .limit(20)\
        .all()

    return {"users": users, "commitments": commitments}