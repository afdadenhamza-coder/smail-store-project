import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.product import OrderIn, OrderOut, ErrorOut
from app.services.order_service import create_order
from app.services.sheets import send_to_sheets
from app.services.capi.meta import send_meta_event
from app.services.capi.tiktok import send_tiktok_event
from app.services.capi.snapchat import send_snapchat_event

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/orders", tags=["orders"])


def validate_moroccan_phone(phone: str) -> bool:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) != 10:
        return False
    if not digits.startswith("05") and not digits.startswith("06") and not digits.startswith("07"):
        return False
    return True


@router.post("", response_model=OrderOut, responses={400: {"model": ErrorOut}})
async def create_order_endpoint(data: OrderIn, request: Request, db: AsyncSession = Depends(get_db)):
    if not validate_moroccan_phone(data.customer_phone):
        raise HTTPException(
            status_code=400,
            detail={"detail": "رقم الهاتف غير صحيح", "code": "INVALID_PHONE"},
        )

    client_ip = request.client.host if request.client else "0.0.0.0"
    client_user_agent = request.headers.get("user-agent", "")

    order = await create_order(db, data, client_ip, client_user_agent)

    asyncio.create_task(
        send_capi_events(data, client_ip, client_user_agent)
    )

    asyncio.create_task(send_to_sheets({
        "order_number": order.order_number,
        "customer_name": data.customer_name,
        "customer_phone": data.customer_phone,
        "items": [item.model_dump() for item in data.items],
        "total": data.total,
        "upsell_accepted": data.upsell_accepted,
        "event_id": data.event_id,
        "client_ip": client_ip,
    }))

    return OrderOut(
        order_id=order.id,
        order_number=order.order_number,
        status=order.status,
        message="تم تأكيد طلبك بنجاح",
    )


async def send_capi_events(data: OrderIn, client_ip: str, client_user_agent: str) -> None:
    contents = [
        {"id": item.product_id, "quantity": item.quantity, "price": item.unit_price}
        for item in data.items
    ]

    await send_meta_event(
        event_name="Purchase",
        event_id=data.event_id,
        email="customer@smailstore.shop",
        phone=data.customer_phone,
        client_ip=client_ip,
        client_user_agent=client_user_agent,
        contents=contents,
        value=data.total,
    )

    await send_tiktok_event(
        event="PlaceAnOrder",
        event_id=data.event_id,
        email="customer@smailstore.shop",
        phone=data.customer_phone,
        client_ip=client_ip,
        client_user_agent=client_user_agent,
        contents=contents,
        value=data.total,
    )

    await send_snapchat_event(
        event_name="PURCHASE",
        event_id=data.event_id,
        email="customer@smailstore.shop",
        phone=data.customer_phone,
        client_ip=client_ip,
        client_user_agent=client_user_agent,
        item_ids=[item.product_id for item in data.items],
        price=[data.total],
    )
