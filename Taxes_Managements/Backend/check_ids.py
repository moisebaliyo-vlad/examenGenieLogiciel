import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    print("--- USERS ---")
    users = conn.execute(text('SELECT id, email FROM users')).fetchall()
    for u in users: print(u)
    
    print("\n--- VENDEURS ---")
    vendeurs = conn.execute(text('SELECT id, nom, prenom FROM vendeurs')).fetchall()
    for v in vendeurs: print(v)
    
    print("\n--- TAXES ---")
    taxes = conn.execute(text('SELECT id, nom FROM taxes')).fetchall()
    for t in taxes: print(t)
