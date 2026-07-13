import httpx
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_to_sheets(payload: dict) -> None:
    if not settings.google_sheets_webhook_url:
        logger.warning("Google Sheets webhook URL not configured")
        return
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(settings.google_sheets_webhook_url, json=payload)
            logger.info(f"Sheets webhook responded with {resp.status_code}")
    except Exception as e:
        logger.error(f"Failed to send to sheets: {e}")
