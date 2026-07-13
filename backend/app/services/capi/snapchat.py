import time
import httpx
import logging
from app.config import get_settings
from app.services.hashing import hash_email, hash_phone_snapchat

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_snapchat_event(
    event_name: str,
    event_id: str,
    email: str,
    phone: str,
    client_ip: str,
    client_user_agent: str,
    item_ids: list[str],
    price: list[float],
    currency: str = "MAD",
) -> None:
    if not settings.snapchat_pixel_id or not settings.snapchat_access_token:
        logger.warning("Snapchat CAPI not configured")
        return

    url = f"https://business-api.snapchat.com/v2/conversions/{settings.snapchat_pixel_id}/events"

    payload = {
        "pixel_id": settings.snapchat_pixel_id,
        "events": [
            {
                "event_name": event_name,
                "event_time": int(time.time()),
                "client_dedup_id": event_id,
                "event_source": "WEB",
                "user_data": {
                    "em": hash_email(email),
                    "ph": hash_phone_snapchat(phone),
                    "client_ip": client_ip,
                    "user_agent": client_user_agent,
                },
                "item_ids": item_ids,
                "price": price,
                "currency": currency,
            }
        ],
    }

    headers = {
        "Authorization": f"Bearer {settings.snapchat_access_token}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            logger.info(f"Snapchat CAPI responded: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        logger.error(f"Snapchat CAPI error: {e}")
