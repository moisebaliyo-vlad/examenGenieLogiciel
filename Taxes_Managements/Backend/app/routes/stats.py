from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.utils.dependencies import get_db
from app.models.paiement import Paiement
from app.models.vendeur import Vendeur
from app.models.user import User
from app.models.signalement import Signalement

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Total collected today
    today = datetime.utcnow().date()
    total_today = db.query(func.sum(Paiement.montant)).filter(func.cast(Paiement.date_paiement, func.Date) == today).scalar() or 0
    
    # Active vendors
    active_vendors = db.query(func.count(Vendeur.id)).filter(Vendeur.is_active == True).scalar() or 0
    
    # Field agents
    field_agents = db.query(func.count(User.id)).filter(User.is_admin == False).scalar() or 0
    
    # Recent payments (last 7 days for chart)
    last_7_days = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        amount = db.query(func.sum(Paiement.montant)).filter(func.cast(Paiement.date_paiement, func.Date) == day).scalar() or 0
        last_7_days.append({
            "day": day.strftime("%a"),
            "amount": amount
        })
    
    # Pending signals
    pending_signals = db.query(func.count(Signalement.id)).scalar() or 0
    
    # Recent activities
    recent_activities = db.query(Paiement).order_by(Paiement.date_paiement.desc()).limit(5).all()
    
    return {
        "total_today": total_today,
        "active_vendors": active_vendors,
        "field_agents": field_agents,
        "chart_data": last_7_days,
        "pending_signals": pending_signals,
        "recent_activities": [
            {
                "id": p.id,
                "vendeur_name": f"{p.vendeur.prenom} {p.vendeur.nom}",
                "montant": p.montant,
                "date": p.date_paiement.isoformat(),
                "taxe_nom": p.taxe.nom
            } for p in recent_activities
        ]
    }
