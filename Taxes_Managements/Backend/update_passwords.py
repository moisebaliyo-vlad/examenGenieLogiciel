import sys
import os
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("No DATABASE_URL found.")
    sys.exit(1)

print(f"Connecting to {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    from app.models.user import User
    
    users = db.query(User).all()
    print(f"Found {len(users)} users.")
    
    valid_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    print(f"New valid hash for 'admin123': {valid_hash}")
    
    updated = 0
    for u in users:
        u.hashed_password = valid_hash
        updated += 1
        
    db.commit()
    print(f"Successfully updated {updated} users with the correct 'admin123' password hash.")
    
except Exception as e:
    import traceback
    traceback.print_exc()
