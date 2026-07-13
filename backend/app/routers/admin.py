import uuid
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.config import get_settings
from app.models.product import Order, ClickEvent
from app.schemas.admin import (
    AdminLogin, AdminToken, DashboardStats,
    DetailedStats, DailyRevenue, TopProduct, OrderStatusDist,
    ProfitCalcIn, ProfitCalcOut,
    OrderListItem, OrderListResponse, OrderDetail, StatusUpdate,
    ClickTrackIn, ClickTrackOut,
)
from app.services.geo import is_valid_morocco_visitor

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])
settings = get_settings()

_admin_tokens: set[str] = set()


def _verify_admin(email: str, password: str) -> bool:
    return email == settings.admin_email and password == settings.admin_password


def _generate_token() -> str:
    return uuid.uuid4().hex + uuid.uuid4().hex


def _require_auth(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.replace("Bearer ", "")
    if token not in _admin_tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return token


@router.post("/login", response_model=AdminToken)
async def login(data: AdminLogin):
    if not _verify_admin(data.email, data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = _generate_token()
    _admin_tokens.add(token)
    return AdminToken(token=token)


@router.post("/logout")
async def logout(token: str = Depends(_require_auth)):
    _admin_tokens.discard(token)
    return {"status": "ok"}


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    token: str = Depends(_require_auth),
    db: AsyncSession = Depends(get_db),
):
    try:
        sd = datetime.strptime(start_date, "%Y-%m-%d") if start_date else datetime(2020, 1, 1)
        ed = datetime.strptime(end_date, "%Y-%m-%d") if end_date else datetime(2099, 12, 31)
        if end_date:
            ed = ed.replace(hour=23, minute=59, second=59)
    except (ValueError, TypeError):
        sd = datetime(2020, 1, 1)
        ed = datetime(2099, 12, 31)

    total_clicks = await db.scalar(
        select(func.count(ClickEvent.id)).where(ClickEvent.created_at.between(sd, ed))
    )

    valid_clicks = await db.scalar(
        select(func.count(ClickEvent.id)).where(
            ClickEvent.is_valid == True,
            ClickEvent.created_at.between(sd, ed),
        )
    )

    all_orders = await db.scalar(
        select(func.count(Order.id)).where(Order.created_at.between(sd, ed))
    )

    confirmed = await db.scalar(
        select(func.count(Order.id)).where(
            Order.status == "confirmed",
            Order.created_at.between(sd, ed),
        )
    )

    revenue_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0)).where(
            Order.status.in_(["confirmed", "delivered"]),
            Order.created_at.between(sd, ed),
        )
    )
    total_revenue = float(revenue_result.scalar() or 0)

    valid = valid_clicks or 0
    confirmed_orders = confirmed or 0
    conversion_rate = (confirmed_orders / valid * 100) if valid > 0 else 0
    avg_order_value = (total_revenue / confirmed_orders) if confirmed_orders > 0 else 0

    return DashboardStats(
        total_clicks=total_clicks or 0,
        valid_clicks=valid,
        total_orders=all_orders or 0,
        confirmed_orders=confirmed_orders,
        total_revenue=round(total_revenue, 2),
        conversion_rate=round(conversion_rate, 2),
        avg_order_value=round(avg_order_value, 2),
    )


@router.get("/stats/detailed", response_model=DetailedStats)
async def get_detailed_stats(
    token: str = Depends(_require_auth),
    db: AsyncSession = Depends(get_db),
):
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start.replace(hour=23, minute=59, second=59)

    # Today
    today_rev = await db.scalar(
        select(func.coalesce(func.sum(Order.total), 0)).where(
            Order.status.in_(["confirmed", "delivered"]),
            Order.created_at.between(today_start, today_end),
        )
    )
    today_orders = await db.scalar(
        select(func.count(Order.id)).where(
            Order.created_at.between(today_start, today_end)
        )
    )

    # Total
    total_rev = await db.scalar(
        select(func.coalesce(func.sum(Order.total), 0)).where(
            Order.status.in_(["confirmed", "delivered"]),
        )
    )
    total_orders = await db.scalar(
        select(func.count(Order.id))
    )

    # Status counts
    status_counts = {}
    for s in ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"]:
        c = await db.scalar(select(func.count(Order.id)).where(Order.status == s))
        status_counts[s] = c or 0

    # Clicks
    total_clicks = await db.scalar(select(func.count(ClickEvent.id)))
    valid_clicks = await db.scalar(
        select(func.count(ClickEvent.id)).where(ClickEvent.is_valid == True)
    )

    valid = valid_clicks or 0
    confirmed_count = status_counts["confirmed"]
    conversion_rate = (confirmed_count / valid * 100) if valid > 0 else 0
    total_revenue_val = float(total_rev or 0)
    avg_order_value = (total_revenue_val / confirmed_count) if confirmed_count > 0 else 0

    # Revenue chart - last 30 days (batched query)
    thirty_days_ago = today_start - timedelta(days=29)
    revenue_chart = []
    try:
        from sqlalchemy import cast, Date, literal
        day_label = func.strftime('%Y-%m-%d', Order.created_at).label('day')
        rev_query = select(
            day_label,
            func.coalesce(func.sum(Order.total), 0).label('revenue'),
            func.count(Order.id).label('orders'),
        ).where(
            Order.created_at >= thirty_days_ago,
            Order.created_at < today_end,
        ).group_by('day').order_by('day')
        result = await db.execute(rev_query)
        daily_map = {}
        for row in result:
            daily_map[row.day] = {"revenue": round(float(row.revenue), 2), "orders": row.orders}
        for i in range(30):
            day = thirty_days_ago + timedelta(days=i)
            key = day.strftime("%Y-%m-%d")
            data = daily_map.get(key, {"revenue": 0, "orders": 0})
            revenue_chart.append(DailyRevenue(date=key, revenue=data["revenue"], orders=data["orders"]))
    except Exception:
        revenue_chart = [DailyRevenue(date=(thirty_days_ago + timedelta(days=i)).strftime("%Y-%m-%d"), revenue=0, orders=0) for i in range(30)]

    # Top products (aggregate from orders JSON)
    top_products = []
    try:
        orders_result = await db.execute(
            select(Order.items).where(
                Order.status.in_(["confirmed", "shipped", "delivered"]),
            )
        )
        product_agg = {}
        for row in orders_result:
            items = row[0] or []
            for item in items:
                name = item.get("product_name", "Unknown")
                qty = item.get("quantity", 1)
                price = item.get("unit_price", 0)
                if name in product_agg:
                    product_agg[name]["qty"] += qty
                    product_agg[name]["rev"] += price * qty
                else:
                    product_agg[name] = {"qty": qty, "rev": price * qty}
        sorted_products = sorted(product_agg.items(), key=lambda x: x[1]["rev"], reverse=True)[:10]
        top_products = [
            TopProduct(product_name=name, quantity=data["qty"], revenue=round(data["rev"], 2))
            for name, data in sorted_products
        ]
    except Exception as e:
        logger.warning(f"Failed to aggregate top products: {e}")

    # Status distribution
    status_labels = {
        "pending": "قيد المراجعة", "confirmed": "مؤكد", "shipped": "تم الشحن",
        "delivered": "تم التوصيل", "cancelled": "ملغي", "returned": "مرتجع",
    }
    status_distribution = [
        OrderStatusDist(status=s, count=status_counts[s], label=status_labels.get(s, s))
        for s in ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"]
    ]

    return DetailedStats(
        today_revenue=round(float(today_rev or 0), 2),
        today_orders=today_orders or 0,
        total_revenue=total_revenue_val,
        total_orders=total_orders or 0,
        pending_orders=status_counts["pending"],
        confirmed_orders=status_counts["confirmed"],
        shipped_orders=status_counts["shipped"],
        delivered_orders=status_counts["delivered"],
        cancelled_orders=status_counts["cancelled"],
        returned_orders=status_counts["returned"],
        valid_clicks=valid,
        total_clicks=total_clicks or 0,
        conversion_rate=round(conversion_rate, 2),
        avg_order_value=round(avg_order_value, 2),
        revenue_chart=revenue_chart,
        top_products=top_products,
        status_distribution=status_distribution,
    )


@router.post("/profit/calculate", response_model=ProfitCalcOut)
async def calculate_profit(data: ProfitCalcIn, token: str = Depends(_require_auth)):
    platform_commission_amount = data.selling_price * (data.platform_commission_pct / 100) + data.platform_commission_fixed
    tax_amount = data.selling_price * (data.tax_pct / 100)
    total_cost = (
        data.product_cost
        + data.shipping_cost
        + data.packaging_cost
        + data.cod_fee
        + platform_commission_amount
        + tax_amount
    )
    net_profit = data.selling_price - total_cost
    profit_margin_pct = (net_profit / data.selling_price * 100) if data.selling_price > 0 else 0
    markup_pct = (net_profit / total_cost * 100) if total_cost > 0 else 0
    break_even = total_cost

    return ProfitCalcOut(
        total_cost=round(total_cost, 2),
        platform_commission_amount=round(platform_commission_amount, 2),
        tax_amount=round(tax_amount, 2),
        net_profit=round(net_profit, 2),
        profit_margin_pct=round(profit_margin_pct, 2),
        markup_pct=round(markup_pct, 2),
        break_even=round(break_even, 2),
    )


@router.get("/orders", response_model=OrderListResponse)
async def list_orders(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    token: str = Depends(_require_auth),
    db: AsyncSession = Depends(get_db),
):
    try:
        sd = datetime.strptime(start_date, "%Y-%m-%d") if start_date else datetime(2020, 1, 1)
        ed = datetime.strptime(end_date, "%Y-%m-%d") if end_date else datetime(2099, 12, 31)
        if end_date:
            ed = ed.replace(hour=23, minute=59, second=59)
    except (ValueError, TypeError):
        sd = datetime(2020, 1, 1)
        ed = datetime(2099, 12, 31)

    base_query = select(Order).where(Order.created_at.between(sd, ed))

    if status:
        base_query = base_query.where(Order.status == status)
    if search:
        base_query = base_query.where(
            (Order.customer_name.ilike(f"%{search}%")) |
            (Order.customer_phone.ilike(f"%{search}%")) |
            (Order.order_number.ilike(f"%{search}%"))
        )

    count_query = select(func.count()).select_from(base_query.subquery())
    total = await db.scalar(count_query) or 0

    query = base_query.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    orders = result.scalars().all()

    return OrderListResponse(
        total=total,
        page=page,
        per_page=per_page,
        orders=[
            OrderListItem(
                id=o.id,
                order_number=o.order_number,
                customer_name=o.customer_name,
                customer_phone=o.customer_phone,
                total=float(o.total),
                status=o.status,
                upsell_accepted=o.upsell_accepted,
                items=o.items,
                items_count=len(o.items),
                created_at=o.created_at,
            )
            for o in orders
        ],
    )


@router.get("/orders/{order_id}", response_model=OrderDetail)
async def get_order(order_id: str, token: str = Depends(_require_auth), db: AsyncSession = Depends(get_db)):
    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid order ID")
    result = await db.execute(select(Order).where(Order.id == uid))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderDetail(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        items=order.items,
        total=float(order.total),
        status=order.status,
        upsell_accepted=order.upsell_accepted,
        upsell_product_id=str(order.upsell_product_id) if order.upsell_product_id else None,
        event_id=order.event_id,
        client_ip=order.client_ip,
        client_user_agent=order.client_user_agent,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    data: StatusUpdate,
    token: str = Depends(_require_auth),
    db: AsyncSession = Depends(get_db),
):
    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid order ID")
    result = await db.execute(select(Order).where(Order.id == uid))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    valid_statuses = {"pending", "confirmed", "shipped", "delivered", "cancelled", "returned"}
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    order.status = data.status
    await db.flush()
    return {"status": "updated", "new_status": order.status}


@router.post("/track", response_model=ClickTrackOut)
async def track_click(data: ClickTrackIn, request: Request, db: AsyncSession = Depends(get_db)):
    ip = request.client.host if request.client else "0.0.0.0"
    user_agent = request.headers.get("user-agent", "")

    is_valid, country, city, is_vpn = await is_valid_morocco_visitor(ip)

    click = ClickEvent(
        path=data.path,
        ip=ip,
        user_agent=user_agent,
        country=country,
        city=city,
        is_vpn=is_vpn,
        is_valid=is_valid and not is_vpn,
        session_id=data.session_id,
    )
    db.add(click)
    await db.flush()
    return ClickTrackOut(tracked=True)
