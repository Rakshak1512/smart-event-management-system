from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth import require_role

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/mark", status_code=200)
def mark_attendance(
    payload: schemas.MarkAttendanceRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = db.query(models.Event).filter(models.Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not the organizer of this event")

    for record in payload.records:
        registration = (
            db.query(models.Registration)
            .filter(
                models.Registration.event_id == payload.event_id,
                models.Registration.student_id == record.student_id,
            )
            .first()
        )
        attendance = (
            db.query(models.Attendance)
            .filter(
                models.Attendance.event_id == payload.event_id,
                models.Attendance.student_id == record.student_id,
            )
            .first()
        )
        if attendance:
            attendance.is_present = record.is_present
        else:
            attendance = models.Attendance(
                event_id=payload.event_id,
                student_id=record.student_id,
                registration_id=registration.id if registration else None,
                is_present=record.is_present,
            )
            db.add(attendance)

        if record.is_present:
            notif = models.Notification(
                user_id=record.student_id,
                title="Attendance Marked",
                message=f"Your attendance for {event.title} has been marked present.",
                type=models.NotificationTypeEnum.attendance,
            )
            db.add(notif)

    db.commit()
    return {"detail": "Attendance updated successfully"}


@router.get("/event/{event_id}")
def get_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    records = db.query(models.Attendance).filter(models.Attendance.event_id == event_id).all()
    return [
        {
            "student_id": r.student_id,
            "is_present": r.is_present,
        }
        for r in records
    ]
