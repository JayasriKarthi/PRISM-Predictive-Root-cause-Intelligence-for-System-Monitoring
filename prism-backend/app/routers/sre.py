from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import SRE
from ..schemas import SRECreate, SREResponse, SREUpdate

router = APIRouter(prefix="/sre", tags=["SRE"])


@router.get("", response_model=List[SREResponse])
def get_all_sres(db: Session = Depends(get_db)):
    """Fetch all SRE users"""
    sres = db.query(SRE).all()
    return sres


@router.post("", response_model=SREResponse, status_code=status.HTTP_201_CREATED)
def create_sre(sre: SRECreate, db: Session = Depends(get_db)):
    """Create a new SRE user"""
    # Check if email already exists
    existing_sre = db.query(SRE).filter(SRE.email == sre.email).first()
    if existing_sre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new SRE
    db_sre = SRE(**sre.model_dump())
    db.add(db_sre)
    db.commit()
    db.refresh(db_sre)
    return db_sre


@router.put("/{sre_id}", response_model=SREResponse)
def update_sre(sre_id: int, sre_update: SREUpdate, db: Session = Depends(get_db)):
    """Update an existing SRE user"""
    db_sre = db.query(SRE).filter(SRE.id == sre_id).first()
    if not db_sre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SRE not found"
        )
    
    # Update fields if provided
    update_data = sre_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sre, field, value)
    
    db.commit()
    db.refresh(db_sre)
    return db_sre


@router.delete("/{sre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sre(sre_id: int, db: Session = Depends(get_db)):
    """Delete an SRE user"""
    db_sre = db.query(SRE).filter(SRE.id == sre_id).first()
    if not db_sre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SRE not found"
        )
    
    db.delete(db_sre)
    db.commit()
    return None


@router.patch("/{sre_id}/status", response_model=SREResponse)
def toggle_sre_status(sre_id: int, db: Session = Depends(get_db)):
    """Toggle SRE status between active and inactive"""
    db_sre = db.query(SRE).filter(SRE.id == sre_id).first()
    if not db_sre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SRE not found"
        )
    
    # Toggle status
    db_sre.status = "inactive" if db_sre.status == "active" else "active"
    db.commit()
    db.refresh(db_sre)
    return db_sre

