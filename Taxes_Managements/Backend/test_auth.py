import sys
import traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Testing connection to {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    from app.models.user import User
    from app.utils.security import verify_password
    
    email = "yves.agent@taxe.app"
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        print(f"Found user: {user.email}")
        result = verify_password("admin123", user.hashed_password)
        print(f"Password verification: {result}")
    else:
        print("User not found.")
        
except Exception as e:
    print("Error occurred:")
    traceback.print_exc()
