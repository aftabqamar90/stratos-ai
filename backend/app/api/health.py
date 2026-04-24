from fastapi import APIRouter
from sqlalchemy import text

from app.database import engine


router = APIRouter(prefix="/api", tags=["status"])


@router.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": "stratos-ai-backend"}


@router.get("/db-status")
def db_status() -> dict:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"connected": True, "database": "sqlite"}
    except Exception as exc:  # pragma: no cover - defensive
        return {"connected": False, "error": str(exc)}
