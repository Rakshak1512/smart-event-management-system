import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/smart_event_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure_dev_secret_change_me")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )
    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL", "https://lustrous-beijinho-52dac2.netlify.app"
    )


settings = Settings()
