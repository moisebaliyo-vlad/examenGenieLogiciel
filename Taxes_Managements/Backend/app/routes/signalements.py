from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.signalement import Signalement
from app.models.user import User
from app.schemas.signalement import SignalementCreate, SignalementOut, SignalementUpdate
from app.models.notification import Notification

router = APIRouter(prefix="/signalements", tags=["signalements"])

@router.post("/", response_model=SignalementOut)
def create_signalement(
    signalement: SignalementCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_signalement = Signalement(
        **signalement.dict(),
        user_id=current_user.id
    )
    db.add(new_signalement)
    db.commit()
    db.refresh(new_signalement)
    return new_signalement

@router.get("/", response_model=List[SignalementOut])
def read_signalements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Signalement).offset(skip).limit(limit).all()

@router.put("/{signalement_id}", response_model=SignalementOut)
def update_signalement(
    signalement_id: int, 
    signalement_update: SignalementUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can update signalements")
    
    db_signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    if not db_signalement:
        raise HTTPException(status_code=404, detail="Signalement not found")
    
    db_signalement.statut = signalement_update.statut
    
    # Notify the user
    notif = Notification(
        user_id=db_signalement.user_id,
        titre=f"Signalement {signalement_update.statut}",
        message=f"Votre signalement '{db_signalement.sujet}' est maintenant {signalement_update.statut}."
    )
    db.add(notif)
    
    db.commit()
    db.refresh(db_signalement)
    return db_signalement
