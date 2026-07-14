import asyncio, sys, os
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
sys.path.insert(0, ".")
from app.database import async_session
from app.models.product import Product
from sqlalchemy import select

async def check():
    async with async_session() as db:
        r = await db.execute(select(Product))
        for p in r.scalars():
            print(f"id={p.id}, name={p.name}, rating={p.rating}, reviews={p.reviews_count}, sizes={p.sizes}")

asyncio.run(check())
