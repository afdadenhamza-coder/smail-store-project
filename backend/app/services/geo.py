import logging
from typing import Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_geoip_reader = None


def _get_geoip_reader():
    global _geoip_reader
    if _geoip_reader is not None:
        return _geoip_reader
    if not settings.geoip_license_key:
        return None
    try:
        import geoip2.database
        _geoip_reader = geoip2.database.Reader(settings.geoip_db_path)
        return _geoip_reader
    except Exception as e:
        logger.warning(f"Failed to load GeoIP database: {e}")
        return None


async def lookup_ip(ip: str) -> tuple[Optional[str], Optional[str]]:
    reader = _get_geoip_reader()
    if reader is None:
        return None, None
    try:
        response = reader.city(ip)
        return response.country.iso_code, response.city.name
    except Exception as e:
        logger.debug(f"GeoIP lookup failed for {ip}: {e}")
        return None, None


async def check_vpn(ip: str) -> bool:
    if not settings.vpn_detection_api_key:
        return False
    try:
        import httpx
        url = settings.vpn_detection_url % (settings.vpn_detection_api_key, ip)
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(url)
            data = resp.json()
            if data.get("success"):
                return data.get("vpn", False) or data.get("proxy", False) or data.get("tor", False)
    except Exception as e:
        logger.debug(f"VPN check failed for {ip}: {e}")
    return False


async def is_valid_morocco_visitor(ip: str) -> tuple[bool, Optional[str], Optional[str], bool]:
    country, city = await lookup_ip(ip)
    if country is None:
        return True, None, None, False
    is_vpn = await check_vpn(ip)
    is_morocco = country == "MA"
    return is_morocco and not is_vpn, country, city, is_vpn
