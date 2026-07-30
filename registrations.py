from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/api/registrations", tags=["Registrations"])


def _notify(db: Session, user_id: int, title: str, message: str, ntype: str):
    notif = models.Notification(user_id=user_id, title=title, message=message, type=ntype)
    db.add(notif)


@router.post("/{event_id}", response_model=schemas.RegistrationOut, status_code=201)
def register_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("student")),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.registration_deadline < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Registration deadline has passed")

    if event.seats_taken >= event.max_seats:
        raise HTTPException(status_code=400, detail="Event is fully booked")

    existing = (
        db.query(models.Registration)
        .filter(
            models.Registration.event_id == event_id,
            models.Registration.student_id == current_user.id,
        )
        .first()
    )
    if existing:
        if existing.status == models.RegistrationStatusEnum.registered:
            raise HTTPException(status_code=400, detail="Already registered for this event")
        existing.status = models.RegistrationStatusEnum.registered
        existing.registered_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        _notify(
            db,
            current_user.id,
            "Registration Successful",
            f"You have registered for {event.title}.",
            models.NotificationTypeEnum.registration,
        )
        db.commit()
        return existing

    registration = models.Registration(event_id=event_id, student_id=current_user.id)
    db.add(registration)
    db.commit()
    db.refresh(registration)

    _notify(
        db,
        current_user.id,
        "Registration Successful",
        f"You have registered for {event.title}.",
        models.NotificationTypeEnum.registration,
    )
    db.commit()
    return registration


@router.delete("/{event_id}", status_code=204)
def cancel_registration(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("student")),
):
    registration = (
        db.query(models.Registration)
        .filter(
            models.Registration.event_id == event_id,
            models.Registration.student_id == current_user.id,
        )
        .first()
    )
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")

    registration.status = models.RegistrationStatusEnum.cancelled
    db.commit()
    return None


@router.get("/me", response_model=List[schemas.RegistrationOut])
def my_registrations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("student")),
):
    regs = (
        db.query(models.Registration)
        .filter(models.Registration.student_id == current_user.id)
        .order_by(models.Registration.registered_at.desc())
        .all()
    )
    result = []
    for r in regs:
        out = schemas.RegistrationOut.model_validate(r)
        event_out = schemas.EventOut.model_validate(r.event)
        event_out.seats_taken = r.event.seats_taken
        event_out.organizer_name = r.event.organizer.name if r.event.organizer else None
        out.event = event_out
        result.append(out)
    return result


@router.get("/event/{event_id}", response_model=List[schemas.RegisteredStudentOut])
def registered_students(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not the organizer of this event")

    regs = (
        db.query(models.Registration)
        .filter(models.Registration.event_id == event_id)
        .all()
    )
    output = []
    for r in regs:
        attendance = (
            db.query(models.Attendance)
            .filter(
                models.Attendance.event_id == event_id,
                models.Attendance.student_id == r.student_id,
            )
            .first()
        )
        output.append(
            schemas.RegisteredStudentOut(
                registration_id=r.id,
                student_id=r.student_id,
                name=r.student.name,
                email=r.student.email,
                department=r.student.department,
                status=r.status,
                is_present=attendance.is_present if attendance else False,
            )
        )
    return output
