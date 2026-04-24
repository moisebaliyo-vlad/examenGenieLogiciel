import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()
# Default to 3308 (MariaDB/WAMP). Change to 3306 in .env if needed.
DATABASE_URL = "mysql+pymysql://root:@localhost:3308/taxe_app_db"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
