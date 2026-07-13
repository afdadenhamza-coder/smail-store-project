import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.models.product import Product, Base


products_seed = [
    Product(
        name="تيشيرت كلاسيك أسود",
        slug="t-shirt-classic-noir",
        price=299.00,
        offer_price=249.00,
        has_offer=True,
        images=["/images/Tshirts Collection.jpg"],
        sizes=["S", "M", "L", "XL"],
        category="t-shirts",
        description="تيشيرت كلاسيك بجودة عالية. مصنوع من القطن الفاخر 100%، مناسب لجميع الإطلالات.",
        is_active=True,
        is_featured=True,
        is_upsell=False,
        rating=4.8,
        reviews_count=127,
    ),
    Product(
        name="تيشيرت أوفرサイズ أبيض",
        slug="t-shirt-oversized-blanc",
        price=349.00,
        offer_price=None,
        has_offer=False,
        images=["/images/Hoodie.jpg"],
        sizes=["S", "M", "L", "XL"],
        category="t-shirts",
        description="تيشيرت أوفرサイズ بقصة عصرية. مريح و أنيق، مناسب للإطلالات الكاجوال و الستريت وير.",
        is_active=True,
        is_featured=True,
        is_upsell=False,
        rating=4.7,
        reviews_count=98,
    ),
    Product(
        name="هودي بريميوم رمادي",
        slug="hoodie-premium-gris",
        price=599.00,
        offer_price=499.00,
        has_offer=True,
        images=["/images/Hoodie.jpg"],
        sizes=["M", "L", "XL"],
        category="hoodies",
        description="هودي بريميوم بجودة استثنائية. قماش ثقيل و دافئ، مناسب لفصل الشتاء.",
        is_active=True,
        is_featured=True,
        is_upsell=False,
        rating=4.9,
        reviews_count=203,
    ),
    Product(
        name="هودي أوفرサイズ أسود",
        slug="hoodie-oversized-noir",
        price=649.00,
        offer_price=None,
        has_offer=False,
        images=["/images/2PAC Hoodie.jpg"],
        sizes=["M", "L", "XL"],
        category="hoodies",
        description="هودي أوفرサイズ بقصة عصرية. مريح جداً و مناسب للإطلالات الجريئة.",
        is_active=True,
        is_featured=False,
        is_upsell=False,
        rating=4.6,
        reviews_count=156,
    ),
    Product(
        name="بنطلون كارغو بيج",
        slug="pant-cargo-beige",
        price=449.00,
        offer_price=399.00,
        has_offer=True,
        images=["/images/Collection 1.jpg"],
        sizes=["S", "M", "L", "XL"],
        category="pants",
        description="بنطلون كارغو بقصة عصرية. جيوب متعددة و قماش متين.",
        is_active=True,
        is_featured=False,
        is_upsell=False,
        rating=4.7,
        reviews_count=89,
    ),
    Product(
        name="جاكيت دينيم كلاسيك",
        slug="jacket-denim-classic",
        price=799.00,
        offer_price=None,
        has_offer=False,
        images=["/images/Jacket.jpg"],
        sizes=["S", "M", "L", "XL"],
        category="jackets",
        description="جاكيت دينيم كلاسيك بجودة عالية. تصميم خالد يناسب جميع الإطلالات.",
        is_active=True,
        is_featured=False,
        is_upsell=False,
        rating=4.5,
        reviews_count=67,
    ),
    Product(
        name="قبعة Smail بريميوم",
        slug="cap-smail-premium",
        price=199.00,
        offer_price=None,
        has_offer=False,
        images=["/images/Black Sweatshirt.jpg"],
        sizes=["M", "L"],
        category="accessories",
        description="قبعة بريميوم بتصميم عصري. تطريز شعار Smail Store.",
        is_active=True,
        is_featured=False,
        is_upsell=True,
        rating=4.9,
        reviews_count=45,
    ),
]


async def seed():
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./smailstore.db")
    connect_args = {}
    if DATABASE_URL.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_sessionmaker(engine, class_=AsyncSession)() as session:
        for product in products_seed:
            session.add(product)
        await session.commit()
        print(f"Seeded {len(products_seed)} products")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
