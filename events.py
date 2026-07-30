from datetime import datetime, date
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app import models, schemas
from app.database import get_db
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/api/events", tags=["Events"])


def to_event_out(event: models.Event) -> schemas.EventOut:
    data = schemas.EventOut.model_validate(event)
    data.seats_taken = event.seats_taken
    data.organizer_name = event.organizer.name if event.organizer else None
    return data


@router.get("", response_model=List[schemas.EventOut])
def list_events(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    upcoming_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = db.query(models.Event)
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(models.Event.title.ilike(like), models.Event.description.ilike(like))
        )
    if category:
        query = query.filter(models.Event.category == category)
    if upcoming_only:
        query = query.filter(models.Event.event_date >= date.today())

    events = query.order_by(models.Event.event_date.asc()).all()
    return [to_event_out(e) for e in events]


@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return to_event_out(event)


@router.post("", response_model=schemas.EventOut, status_code=201)
def create_event(
    payload: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = models.Event(**payload.model_dump(), organizer_id=current_user.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return to_event_out(event)


@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(
    event_id: int,
    payload: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not the organizer of this event")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return to_event_out(event)


@router.delete("/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not the organizer of this event")
    db.delete(event)
    db.commit()
    return None


@router.get("/faculty/mine", response_model=List[schemas.EventOut])
def my_created_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    events = (
        db.query(models.Event)
        .filter(models.Event.organizer_id == current_user.id)
        .order_by(models.Event.event_date.asc())
        .all()
    )
    return [to_event_out(e) for e in events]
