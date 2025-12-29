import firebase_admin
from firebase_admin import auth, credentials
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT THIS
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# 1. Create Database Tables (If they don't exist yet)
models.Base.metadata.create_all(bind=engine)

# 2. Initialize Firebase
# Make sure this file is inside your nook-api folder
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

app = FastAPI()

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