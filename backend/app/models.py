import enum
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Date,
    Time,
    ForeignKey,
    Enum,
    Boolean,
    Float,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.database import Base


class RoleEnum(str, enum.Enum):
    student = "student"
    faculty = "faculty"


class RegistrationStatusEnum(str, enum.Enum):
    registered = "registered"
    cancelled = "cancelled"


class NotificationTypeEnum(str, enum.Enum):
    registration = "registration"
    reminder = "reminder"
    attendance = "attendance"
    general = "general"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.student)
    department = Column(String(150), nullable=True)
    student_id = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    events_created = relationship("Event", back_populates="organizer")
    registrations = relationship("Registration", back_populates="student")
    notifications = relationship("Notification", back_populates="user")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    venue = Column(String(200), nullable=False)
    event_date = Column(Date, nullable=False)
    event_time = Column(Time, nullable=False)
    max_seats = Column(Integer, nullable=False, default=100)
    registration_deadline = Column(DateTime, nullable=False)
    banner_url = Column(String(500), nullable=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    organizer = relationship("User", back_populates="events_created")
    registrations = relationship(
        "Registration", back_populates="event", cascade="all, delete-orphan"
    )
    attendance_records = relationship(
        "Attendance", back_populates="event", cascade="all, delete-orphan"
    )

    @property
    def seats_taken(self):
        return len(
            [r for r in self.registrations if r.status == RegistrationStatusEnum.registered]
        )


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (UniqueConstraint("event_id", "student_id", name="uq_event_student"),)

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(
        Enum(RegistrationStatusEnum),
        default=RegistrationStatusEnum.registered,
        nullable=False,
    )
    registered_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="registrations")
    student = relationship("User", back_populates="registrations")
    attendance = relationship(
        "Attendance", back_populates="registration", uselist=False, cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("event_id", "student_id", name="uq_att_event_student"),)

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    registration_id = Column(Integer, ForeignKey("registrations.id"), nullable=True)
    is_present = Column(Boolean, default=False)
    marked_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="attendance_records")
    registration = relationship("Registration", back_populates="attendance")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    certificate_code = Column(String(64), unique=True, nullable=False)
    file_path = Column(String(500), nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event")
    student = relationship("User")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationTypeEnum), default=NotificationTypeEnum.general)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
