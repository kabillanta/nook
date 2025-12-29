from sqlalchemy.sql import func
from database import Base
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Firebase UID
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    commitments = relationship("Commitment", back_populates="owner")

class Commitment(Base):
    __tablename__ = "commitments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="pending") # pending, kept, broken
    witness_count = Column(Integer, default=0)
    
    # Link to User
    user_id = Column(String, ForeignKey("users.id"))
    
    # It tells Commitment: "You belong to an Owner (User)"
    owner = relationship("User", back_populates="commitments")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())