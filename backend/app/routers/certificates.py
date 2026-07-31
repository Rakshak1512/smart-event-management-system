from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.auth import require_role
from app.utils.certificate_generator import generate_certificate

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


@router.post("/generate/{event_id}", response_model=List[schemas.CertificateOut])
def generate_certificates_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("faculty")),
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not the organizer of this event")

    present_records = (
        db.query(models.Attendance)
        .filter(models.Attendance.event_id == event_id, models.Attendance.is_present == True)  # noqa: E712
        .all()
    )
    if not present_records:
        raise HTTPException(status_code=400, detail="No students marked present for this event")

    certificates = []
    for record in present_records:
        existing = (
            db.query(models.Certificate)
            .filter(
                models.Certificate.event_id == event_id,
                models.Certificate.student_id == record.student_id,
            )
            .first()
        )
        if existing:
            certificates.append(existing)
            continue

        student = db.query(models.User).filter(models.User.id == record.student_id).first()
        code, filepath = generate_certificate(
            student.name, event.title, event.event_date.strftime("%B %d, %Y")
        )
        cert = models.Certificate(
            event_id=event_id,
            student_id=record.student_id,
            certificate_code=code,
            file_path=filepath,
        )
        db.add(cert)
        db.commit()
        db.refresh(cert)
        certificates.append(cert)

    return certificates


@router.get("/me", response_model=List[schemas.CertificateOut])
def my_certificates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("student")),
):
    return (
        db.query(models.Certificate)
        .filter(models.Certificate.student_id == current_user.id)
        .all()
    )


@router.get("/download/{certificate_id}")
def download_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("student")),
):
    cert = (
        db.query(models.Certificate)
        .filter(
            models.Certificate.id == certificate_id,
            models.Certificate.student_id == current_user.id,
        )
        .first()
    )
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    return FileResponse(
        cert.file_path,
        media_type="application/pdf",
        filename=f"{cert.certificate_code}.pdf",
    )
