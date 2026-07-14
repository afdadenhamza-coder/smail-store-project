import asyncio, sys, os
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
sys.path.insert(0, ".")
from app.database import async_session, engine
from app.models.product import Product, Base
from sqlalchemy import select, func

async def check():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        r = await db.execute(select(Product))
        for p in r.scalars():
            name = p.name.encode("ascii", "replace").decode()
            print(f"{name}: rating={p.rating}, reviews={p.reviews_count}, sizes={p.sizes}")

asyncio.run(check())
