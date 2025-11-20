from pydantic import BaseModel, EmailStr
from typing import Optional


class SREBase(BaseModel):
    name: str 
    email: EmailStr
    status: str = "active"
    assigned_system: Optional[str] = None


class SRECreate(SREBase):
    pass


class SREUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[str] = None
    assigned_system: Optional[str] = None


class SREResponse(SREBase):
    id: int

    class Config:
        from_attributes = True

