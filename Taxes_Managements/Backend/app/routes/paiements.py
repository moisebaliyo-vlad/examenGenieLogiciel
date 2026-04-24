from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.paiement import Paiement
from app.schemas.paiement import PaiementCreate, PaiementOut
from app.models.user import User

from app.models.notification import Notification

router = APIRouter(prefix="/paiements", tags=["paiements"])

@router.post("/", response_model=PaiementOut)
def create_paiement(
    paiement: PaiementCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_paiement = db.query(Paiement).filter(Paiement.reference == paiement.reference).first()
    if db_paiement:
        raise HTTPException(status_code=400, detail="Paiement reference already exists")
    
    new_paiement = Paiement(
        **paiement.dict(),
        collection_user_id=current_user.id
    )
    db.add(new_paiement)
    
    # Notify all admins
    admins = db.query(User).filter(User.is_admin == True).all()
    for admin in admins:
        notif = Notification(
            user_id=admin.id,
            titre="Nouveau paiement reçu",
            message=f"Un paiement de {paiement.montant} FC a été enregistré pour le vendeur ID {paiement.vendeur_id}."
        )
        db.add(notif)
        
    db.commit()
    db.refresh(new_paiement)
    return new_paiement

@router.get("/vendeur/{vendeur_id}", response_model=List[PaiementOut])
def read_paiements_by_vendeur(vendeur_id: int, db: Session = Depends(get_db)):
    return db.query(Paiement).filter(Paiement.vendeur_id == vendeur_id).order_by(Paiement.date_paiement.desc()).all()

@router.get("/", response_model=List[PaiementOut])
def read_paiements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Paiement).offset(skip).limit(limit).all()
