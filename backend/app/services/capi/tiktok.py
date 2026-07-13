import time
import httpx
import logging
from app.config import get_settings
from app.services.hashing import hash_email, hash_phone_tiktok

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_tiktok_event(
    event: str,
    event_id: str,
    email: str,
    phone: str,
    client_ip: str,
    client_user_agent: str,
    contents: list[dict],
    value: float,
    currency: str = "MAD",
) -> None:
    if not settings.tiktok_pixel_code or not settings.tiktok_access_token:
        logger.warning("TikTok Events API not configured")
        return

    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"

    payload = {
        "event_source": "web",
        "event_source_id": settings.tiktok_pixel_code,
        "data": [
            {
                "event": event,
                "event_time": int(time.time()),
                "event_id": event_id,
                "user": {
                    "email": hash_email(email),
                    "phone": hash_phone_tiktok(phone),
                    "ip": client_ip,
                    "user_agent": client_user_agent,
                },
                "properties": {
                    "contents": contents,
                    "value": value,
                    "currency": currency,
                },
            }
        ],
    }

    headers = {"Access-Token": settings.tiktok_access_token}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            logger.info(f"TikTok API responded: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        logger.error(f"TikTok API error: {e}")
