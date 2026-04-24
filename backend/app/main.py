import os
import logging

from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.health import router as health_router


app = FastAPI(title="Stratos AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("stratos.backend")
if not logger.handlers:
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("Request started: %s %s", request.method, request.url.path)
    response = await call_next(request)
    logger.info(
        "Request completed: %s %s -> %s",
        request.method,
        request.url.path,
        response.status_code,
    )
    return response

app.include_router(health_router)


@app.get("/scalar", include_in_schema=False)
def scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Stratos AI API Docs"
    )
