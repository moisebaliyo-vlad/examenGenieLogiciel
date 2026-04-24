from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.taxe import Taxe
from app.models.user import User
from app.schemas.taxe import TaxeCreate, TaxeOut, TaxeUpdate

router = APIRouter(prefix="/taxes", tags=["taxes"])

@router.post("/", response_model=TaxeOut)
def create_taxe(taxe: TaxeCreate, db: Session = Depends(get_db)):
    # Protect this route in a real scenario to admins only
    new_taxe = Taxe(**taxe.dict())
    db.add(new_taxe)
    db.commit()
    db.refresh(new_taxe)
    return new_taxe

@router.get("/", response_model=List[TaxeOut])
def read_taxes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Taxe).offset(skip).limit(limit).all()

@router.get("/{taxe_id}", response_model=TaxeOut)
def read_taxe(taxe_id: int, db: Session = Depends(get_db)):
    taxe = db.query(Taxe).filter(Taxe.id == taxe_id).first()
    if taxe is None:
        raise HTTPException(status_code=404, detail="Taxe not found")
    return taxe

@router.put("/{taxe_id}", response_model=TaxeOut)
def update_taxe(taxe_id: int, taxe_update: TaxeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can update taxes")
    
    db_taxe = db.query(Taxe).filter(Taxe.id == taxe_id).first()
    if not db_taxe:
        raise HTTPException(status_code=404, detail="Taxe not found")
    
    update_data = taxe_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_taxe, key, value)
        
    db.commit()
    db.refresh(db_taxe)
    return db_taxe
