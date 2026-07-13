import time
import httpx
import logging
from app.config import get_settings
from app.services.hashing import hash_email, hash_phone_meta

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_meta_event(
    event_name: str,
    event_id: str,
    email: str,
    phone: str,
    client_ip: str,
    client_user_agent: str,
    contents: list[dict],
    value: float,
    currency: str = "MAD",
    event_source_url: str = "https://smailstore.shop",
) -> None:
    if not settings.meta_pixel_id or not settings.meta_access_token:
        logger.warning("Meta CAPI not configured")
        return

    url = f"https://graph.facebook.com/v25.0/{settings.meta_pixel_id}/events"

    payload = {
        "data": [
            {
                "event_name": event_name,
                "event_time": int(time.time()),
                "event_id": event_id,
                "event_source_url": event_source_url,
                "action_source": "website",
                "user_data": {
                    "em": [hash_email(email)],
                    "ph": [hash_phone_meta(phone)],
                    "client_ip_address": client_ip,
                    "client_user_agent": client_user_agent,
                },
                "custom_data": {
                    "contents": contents,
                    "value": value,
                    "currency": currency,
                    "content_type": "product",
                },
            }
        ],
    }

    if settings.meta_test_event_code:
        payload["test_event_code"] = settings.meta_test_event_code

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            logger.info(f"Meta CAPI responded: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        logger.error(f"Meta CAPI error: {e}")
