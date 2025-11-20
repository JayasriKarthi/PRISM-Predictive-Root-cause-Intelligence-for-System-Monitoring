from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Optional


# Get the backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).parent.parent

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/prism_db"
    
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    
    # JWT settings
    ACCESS_SECRET_KEY: str = "your-access-secret-key-change-in-production"
    REFRESH_SECRET_KEY: str = "your-refresh-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        case_sensitive=True,
        env_file_encoding="utf-8"
    )


settings = Settings()

