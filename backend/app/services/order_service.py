import uuid
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Order
from app.schemas.product import OrderIn


def _parse_uuid(val: str | None) -> uuid.UUID | None:
    if not val:
        return None
    try:
        return uuid.UUID(val)
    except (ValueError, AttributeError):
        return None


async def generate_order_number(db: AsyncSession) -> str:
    year = datetime.utcnow().year
    prefix = f"SMA-{year}"
    result = await db.execute(
        select(Order.order_number).where(Order.order_number.like(f"{prefix}%"))
    )
    existing = result.scalars().all()
    max_num = 0
    for num in existing:
        try:
            n = int(num[len(prefix):])
            if n > max_num:
                max_num = n
        except (ValueError, IndexError):
            continue
    return f"{prefix}{max_num + 1:03d}"


async def create_order(db: AsyncSession, data: OrderIn, client_ip: str, client_user_agent: str) -> Order:
    order_number = await generate_order_number(db)

    order = Order(
        id=uuid.uuid4(),
        order_number=order_number,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        items=[item.model_dump() for item in data.items],
        total=data.total,
        upsell_accepted=data.upsell_accepted,
        upsell_product_id=_parse_uuid(data.upsell_product_id),
        status="confirmed",
        event_id=data.event_id,
        client_ip=client_ip,
        client_user_agent=client_user_agent,
    )

    db.add(order)
    await db.flush()
    return order
