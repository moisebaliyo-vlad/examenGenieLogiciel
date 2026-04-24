from pydantic import BaseModel
from typing import Optional

class TaxeBase(BaseModel):
    nom: str
    montant_base: float
    frequence: str
    description: Optional[str] = None

class TaxeCreate(TaxeBase):
    pass

class TaxeUpdate(BaseModel):
    nom: Optional[str] = None
    montant_base: Optional[float] = None
    frequence: Optional[str] = None
    description: Optional[str] = None

class TaxeOut(TaxeBase):
    id: int

    class Config:
        from_attributes = True
