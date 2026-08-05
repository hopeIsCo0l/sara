import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BOT_TOKEN: str = "DEFAULT_BOT_TOKEN"
    ALLOWED_ADMIN_IDS: str = ""  # Comma-separated Telegram User IDs, e.g. "12345,67890"
    
    SUPABASE_URL: str = "https://example.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "DEFAULT_SERVICE_ROLE_KEY"
    
    PORT: int = 8000
    ENVIRONMENT: str = "development"

    @property
    def admin_id_list(self) -> List[int]:
        if not self.ALLOWED_ADMIN_IDS:
            return []
        return [int(x.strip()) for x in self.ALLOWED_ADMIN_IDS.split(",") if x.strip().isdigit()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
