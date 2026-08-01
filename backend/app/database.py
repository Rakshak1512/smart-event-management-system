from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings


def normalize_database_url(raw_url: str) -> str:
    if not raw_url:
        raise ValueError("DATABASE_URL is not set")

    if raw_url.startswith("postgresql://"):
        raw_url = raw_url.replace("postgresql://", "postgresql+psycopg://", 1)

    parsed = urlparse(raw_url)
    if parsed.scheme in {"postgresql", "postgresql+psycopg"}:
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        if "sslmode" not in query:
            query["sslmode"] = "require"
            raw_url = urlunparse(parsed._replace(query=urlencode(query)))

    return raw_url


DATABASE_URL = normalize_database_url(settings.DATABASE_URL)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()