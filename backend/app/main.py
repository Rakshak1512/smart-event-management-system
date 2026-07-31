import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app import models  # noqa: F401
from app.routers import (
    auth,
    events,
    registrations,
    attendance,
    certificates,
    notifications,
    analytics,
    upload,
)

# Create tables automatically on startup (in addition to Alembic migrations,
# this makes the project runnable immediately for a hackathon demo).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Event Management System API",
    description="Backend API for the Smart Event Management System for College",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(attendance.router)
app.include_router(certificates.router)
app.include_router(notifications.router)
app.include_router(analytics.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "Smart Event Management System API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
