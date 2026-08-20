from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
import auth

router = APIRouter(prefix="/entries", tags=["entries"])

from typing import List

@router.post("/", response_model=schemas.EntryOut)
def create_entry(
    entry: schemas.EntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_entry = models.Entry(
        amount=entry.amount,
        category=entry.category,
        date=entry.date,
        note=entry.note,
        user_id=current_user.id
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("/", response_model=List[schemas.EntryOut])
def list_entries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Entry).filter(models.Entry.user_id == current_user.id).all()

def get_entry_or_404(entry_id: int, db: Session, current_user: models.User):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    if entry.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.put("/{entry_id}", response_model=schemas.EntryOut)
def update_entry(
    entry_id: int,
    updated: schemas.EntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    entry = get_entry_or_404(entry_id, db, current_user)

    entry.amount = updated.amount
    entry.category = updated.category
    entry.date = updated.date
    entry.note = updated.note

    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    entry = get_entry_or_404(entry_id, db, current_user)

    db.delete(entry)
    db.commit()
    return {"detail": "Entry deleted"}