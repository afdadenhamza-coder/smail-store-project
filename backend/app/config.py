from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql+asyncpg://smailstore_user:password@db:5432/smailstore"
    cors_origins: str = "http://localhost:3000,https://smailstore.shop"
    secret_key: str = "change-me"

    meta_pixel_id: str = ""
    meta_access_token: str = ""
    meta_test_event_code: str = ""

    tiktok_pixel_code: str = ""
    tiktok_access_token: str = ""

    snapchat_pixel_id: str = ""
    snapchat_access_token: str = ""

    google_sheets_webhook_url: str = ""

    admin_email: str = "admin@smailstore.shop"
    admin_password: str = "change-me-admin-password"

    geoip_license_key: str = ""
    geoip_db_path: str = "/usr/share/GeoIP/GeoLite2-City.mmdb"
    vpn_detection_api_key: str = ""
    vpn_detection_url: str = "https://ipqualityscore.com/api/json/ip/%s/%s"

    model_config = {"env_file": ".env", "case_sensitive": False}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
