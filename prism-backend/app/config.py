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
    
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        case_sensitive=True,
        env_file_encoding="utf-8"
    )


settings = Settings()

