from datetime import datetime, date, time
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict

from app.models import RoleEnum, RegistrationStatusEnum, NotificationTypeEnum


# ---------- Auth / User ----------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str] = None
    student_id: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.student


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role: RoleEnum
    avatar_url: Optional[str] = None
    created_at: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    student_id: Optional[str] = None
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Event ----------
class EventBase(BaseModel):
    title: str
    description: str
    category: str
    venue: str
    event_date: date
    event_time: time
    max_seats: int
    registration_deadline: datetime
    banner_url: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    venue: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[time] = None
    max_seats: Optional[int] = None
    registration_deadline: Optional[datetime] = None
    banner_url: Optional[str] = None


class EventOut(EventBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    organizer_id: int
    created_at: datetime
    seats_taken: int = 0
    organizer_name: Optional[str] = None


# ---------- Registration ----------
class RegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    event_id: int
    student_id: int
    status: RegistrationStatusEnum
    registered_at: datetime
    event: Optional[EventOut] = None


class RegisteredStudentOut(BaseModel):
    registration_id: int
    student_id: int
    name: str
    email: str
    department: Optional[str] = None
    status: RegistrationStatusEnum
    is_present: Optional[bool] = False


# ---------- Attendance ----------
class MarkAttendanceItem(BaseModel):
    student_id: int
    is_present: bool


class MarkAttendanceRequest(BaseModel):
    event_id: int
    records: List[MarkAttendanceItem]


# ---------- Certificate ----------
class CertificateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    event_id: int
    student_id: int
    certificate_code: str
    file_path: str
    issued_at: datetime


# ---------- Notification ----------
class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    message: str
    type: NotificationTypeEnum
    is_read: bool
    created_at: datetime


# ---------- Analytics ----------
class AnalyticsOut(BaseModel):
    total_events: int
    total_registrations: int
    upcoming_events: int
    attendance_percentage: float
    registrations_by_month: List[dict]
    events_by_category: List[dict]
