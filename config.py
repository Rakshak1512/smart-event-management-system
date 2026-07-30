import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "mysql+pymysql://root:password@localhost/smart_event_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure_dev_secret_change_me")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
