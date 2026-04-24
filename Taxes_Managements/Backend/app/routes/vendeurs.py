from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.vendeur import Vendeur
from app.schemas.vendeur import VendeurCreate, VendeurOut, VendeurUpdate
from app.models.user import User

router = APIRouter(prefix="/vendeurs", tags=["vendeurs"])

@router.post("/", response_model=VendeurOut)
def create_vendeur(vendeur: VendeurCreate, db: Session = Depends(get_db)):
    db_vendeur = db.query(Vendeur).filter(Vendeur.identifiant_national == vendeur.identifiant_national).first()
    if db_vendeur:
        raise HTTPException(status_code=400, detail="Vendeur already registered")
    
    new_vendeur = Vendeur(**vendeur.dict())
    new_vendeur.is_active = False # New vendors must be validated
    db.add(new_vendeur)
    db.commit()
    db.refresh(new_vendeur)
    return new_vendeur

@router.get("/by-identifiant/{identifiant_national}", response_model=VendeurOut)
def read_vendeur_by_identifiant(identifiant_national: str, db: Session = Depends(get_db)):
    vendeur = db.query(Vendeur).filter(Vendeur.identifiant_national == identifiant_national).first()
    if vendeur is None:
        raise HTTPException(status_code=404, detail="Vendeur not found")
    if not vendeur.is_active:
        raise HTTPException(status_code=403, detail="Account not yet validated by admin")
    return vendeur

@router.get("/", response_model=List[VendeurOut])
def read_vendeurs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Vendeur).offset(skip).limit(limit).all()

@router.get("/search/{query}", response_model=List[VendeurOut])
def search_vendeurs(query: str, db: Session = Depends(get_db)):
    return db.query(Vendeur).filter(
        (Vendeur.nom.ilike(f"%{query}%")) | 
        (Vendeur.prenom.ilike(f"%{query}%")) | 
        (Vendeur.identifiant_national.ilike(f"%{query}%"))
    ).all()

@router.get("/{vendeur_id}", response_model=VendeurOut)
def read_vendeur(vendeur_id: int, db: Session = Depends(get_db)):
    vendeur = db.query(Vendeur).filter(Vendeur.id == vendeur_id).first()
    if vendeur is None:
        raise HTTPException(status_code=404, detail="Vendeur not found")
    return vendeur

@router.put("/{vendeur_id}", response_model=VendeurOut)
def update_vendeur(
    vendeur_id: int, 
    vendeur_update: VendeurUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can update vendors")
    
    db_vendeur = db.query(Vendeur).filter(Vendeur.id == vendeur_id).first()
    if not db_vendeur:
        raise HTTPException(status_code=404, detail="Vendeur not found")
    
    update_data = vendeur_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_vendeur, key, value)
        
    db.commit()
    db.refresh(db_vendeur)
    return db_vendeur
