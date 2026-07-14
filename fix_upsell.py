import asyncio, json, sys, os
os.chdir(os.path.join(os.path.dirname(__file__), "backend"))
sys.path.insert(0, ".")
from app.database import async_session, engine
from app.models.product import Product, Base
from sqlalchemy import select

async def fix():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        result = await db.execute(select(Product))
        for p in result.scalars():
            if p.name == "BLONDE TSHIRT":
                p.is_upsell = False
                print(f"Fixed: {p.name} is_upsell -> False")
        await db.commit()
        print("Done!")

asyncio.run(fix())
