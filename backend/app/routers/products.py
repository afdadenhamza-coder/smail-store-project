from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.is_active == True, Product.is_upsell == False)
    )
    products = result.scalars().all()
    return products


@router.get("/featured", response_model=list[ProductOut])
async def list_featured(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.is_active == True, Product.is_upsell == False, Product.is_featured == True)
    )
    return result.scalars().all()


@router.get("/by-slug/{slug}", response_model=ProductOut)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="المنتج غير موجود")
    return product


@router.get("/by-category/{category}", response_model=list[ProductOut])
async def get_products_by_category(category: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).where(Product.category == category, Product.is_active == True, Product.is_upsell == False)
    )
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    try:
        from uuid import UUID
        uid = UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid product ID")

    result = await db.execute(select(Product).where(Product.id == uid, Product.is_active == True))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="المنتج غير موجود")
    return product
