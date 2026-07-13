from fastapi import APIRouter

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/sheets")
async def sheets_webhook():
    return {"status": "ok"}
