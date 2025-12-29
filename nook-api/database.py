from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import dotenv
import os

dotenv.load_dotenv()
password = os.getenv("SUPABASE_PASSWORD")

SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{password}@db.vhxnotsaleswstslspgg.supabase.co:5432/postgres"

# We use pool_pre_ping=True to handle Supabase disconnecting idle connections
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()