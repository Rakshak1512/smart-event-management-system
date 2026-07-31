"""
Run this script to seed the database with demo users and events.

Usage:
    python seed.py
"""
from datetime import date, time, timedelta, datetime

from app.database import Base, engine, SessionLocal
from app import models
from app.auth import get_password_hash

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(models.User).filter(models.User.email == "faculty@college.edu").first():
    faculty = models.User(
        name="Dr. Ananya Rao",
        email="faculty@college.edu",
        hashed_password=get_password_hash("password123"),
        role=models.RoleEnum.faculty,
        department="Computer Science",
    )
    db.add(faculty)
    db.commit()
    db.refresh(faculty)
else:
    faculty = db.query(models.User).filter(models.User.email == "faculty@college.edu").first()

if not db.query(models.User).filter(models.User.email == "student@college.edu").first():
    student = models.User(
        name="Rahul Sharma",
        email="student@college.edu",
        hashed_password=get_password_hash("password123"),
        role=models.RoleEnum.student,
        department="Computer Science",
        student_id="CS2024001",
    )
    db.add(student)
    db.commit()

demo_events = [
    {
        "title": "AI & Machine Learning Summit",
        "description": "A full-day summit exploring the latest trends in AI, ML, and generative technologies with industry experts.",
        "category": "Technology",
        "venue": "Main Auditorium",
        "event_date": date.today() + timedelta(days=10),
        "event_time": time(10, 0),
        "max_seats": 150,
        "registration_deadline": datetime.utcnow() + timedelta(days=8),
        "banner_url": None,
    },
    {
        "title": "Annual Cultural Fest - Rhythms",
        "description": "Celebrate music, dance, and drama with performances from every department across the college.",
        "category": "Cultural",
        "venue": "Open Air Theatre",
        "event_date": date.today() + timedelta(days=20),
        "event_time": time(17, 30),
        "max_seats": 500,
        "registration_deadline": datetime.utcnow() + timedelta(days=18),
        "banner_url": None,
    },
    {
        "title": "Inter-College Hackathon 2026",
        "description": "24-hour hackathon challenging students to build innovative solutions for real-world problems.",
        "category": "Technology",
        "venue": "Innovation Lab",
        "event_date": date.today() + timedelta(days=5),
        "event_time": time(9, 0),
        "max_seats": 80,
        "registration_deadline": datetime.utcnow() + timedelta(days=3),
        "banner_url": None,
    },
]

if not db.query(models.Event).first():
    for e in demo_events:
        event = models.Event(**e, organizer_id=faculty.id)
        db.add(event)
    db.commit()

db.close()
print("Database seeded successfully!")
print("Faculty login -> email: faculty@college.edu | password: password123")
print("Student login -> email: student@college.edu | password: password123")
