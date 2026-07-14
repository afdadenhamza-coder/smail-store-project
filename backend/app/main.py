import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.routers import products, orders, webhooks, admin
from app.database import engine
from app.models.product import Base
from alembic import command
from alembic.config import Config

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Smail Store API")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Run Alembic migrations
    try:
        import pathlib
        alembic_ini_path = pathlib.Path(__file__).parent.parent / "alembic.ini"
        if alembic_ini_path.exists():
            alembic_cfg = Config(str(alembic_ini_path))
            alembic_cfg.set_main_option("sqlalchemy.url", settings.database_url)
            command.upgrade(alembic_cfg, "head")
            logger.info("Migrations completed successfully")
        else:
            logger.warning(f"alembic.ini not found at {alembic_ini_path}, skipping migrations")
    except Exception as e:
        logger.warning(f"Migration error: {e}")
    
    yield
    logger.info("Shutting down Smail Store API")


app = FastAPI(
    title="Smail Store API",
    description="Backend API for Smail Store e-commerce",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(webhooks.router)
app.include_router(admin.router)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
