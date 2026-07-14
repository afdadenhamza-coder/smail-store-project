import asyncio, json, os
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
import sys
sys.path.insert(0, ".")

from app.database import async_session, engine
from app.models.product import Product, Base
from sqlalchemy import select, func


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        count = await db.scalar(select(func.count(Product.id)))
        print(f"Current count: {count}")
        if count and count > 0:
            print("Already seeded, skipping")
            return

        with open(os.path.join(os.path.dirname(__file__), "seed_products.json"), "r", encoding="utf-8") as f:
            items = json.load(f)

        for item in items:
            product = Product(
                name=item["name"],
                slug=item["slug"],
                price=item["price"],
                offer_price=item.get("offer_price"),
                has_offer=item.get("has_offer", False),
                images=item.get("images", []),
                sizes=item.get("sizes", ["S", "M", "L", "XL"]),
                category=item.get("category", ""),
                description=item.get("description", ""),
                is_active=item.get("is_active", True),
                is_featured=item.get("is_featured", False),
                is_upsell=item.get("is_upsell", False),
                rating=item.get("rating", 0.0),
                reviews_count=item.get("reviews_count", 0),
            )
            db.add(product)

        await db.commit()
        print(f"Seeded {len(items)} products successfully!")

asyncio.run(seed())
