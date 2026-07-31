from datetime import date
from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth import require_role

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=schemas.AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    events = (
        db.query(models.Event)
        .filter(models.Event.organizer_id == current_user.id)
        .all()
    )
    event_ids = [e.id for e in events]

    total_events = len(events)
    upcoming_events = len([e for e in events if e.event_date >= date.today()])

    registrations = (
        db.query(models.Registration)
        .filter(models.Registration.event_id.in_(event_ids))
        .all()
        if event_ids
        else []
    )
    total_registrations = len(registrations)

    attendance_records = (
        db.query(models.Attendance)
        .filter(models.Attendance.event_id.in_(event_ids))
        .all()
        if event_ids
        else []
    )
    present_count = len([a for a in attendance_records if a.is_present])
    attendance_percentage = (
        round((present_count / len(attendance_records)) * 100, 2) if attendance_records else 0.0
    )

    month_counts = defaultdict(int)
    for r in registrations:
        key = r.registered_at.strftime("%b %Y")
        month_counts[key] += 1
    registrations_by_month = [{"month": k, "count": v} for k, v in month_counts.items()]

    category_counts = defaultdict(int)
    for e in events:
        category_counts[e.category] += 1
    events_by_category = [{"category": k, "count": v} for k, v in category_counts.items()]

    return schemas.AnalyticsOut(
        total_events=total_events,
        total_registrations=total_registrations,
        upcoming_events=upcoming_events,
        attendance_percentage=attendance_percentage,
        registrations_by_month=registrations_by_month,
        events_by_category=events_by_category,
    )
