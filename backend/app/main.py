import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from scalar_fastapi import get_scalar_api_reference
from sqlalchemy.orm import Session

# Load environment variables from repository root .env before app imports.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from app.api.health import router as health_router
from app.api.projects import router as projects_router
from app.api.project_trainings import router as project_trainings_router
from app.api.project_training_results import router as project_training_results_router
from app.api.dspy_solver import router as dspy_solver_router
from app.core.engine import StratosEngine
from app.database import SessionLocal, engine
from app.models import Base, Project, ProjectTraining, ProjectTrainingResult, TrainingResult, TrainingTask
from app.schemas import TrainRequest, TrainResponse, TrainingResultRead

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stratos Engine API", docs_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router)
app.include_router(projects_router)
app.include_router(project_trainings_router)
app.include_router(project_training_results_router)
app.include_router(dspy_solver_router)


@app.get("/docs", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(openapi_url=app.openapi_url, title=app.title)


stratos_logic = StratosEngine(api_key=os.getenv("OPENROUTER_API_KEY"))


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- 1. THE TRAINING ENDPOINT ---
@app.post("/v1/train", response_model=TrainResponse)
async def run_training(payload: TrainRequest, db: Session = Depends(get_db)):
    """
    Accepts: { project_name, task_name, prompt, data }
    Does: Evolution via GEPA and saves results.
    """
    try:
        # Step A: Ensure Project exists
        project = db.query(Project).filter(Project.name == payload.project_name).first()
        if not project:
            project = Project(name=payload.project_name)
            db.add(project)
            db.commit()
            db.refresh(project)

        # Step B: Create a new Task
        task = TrainingTask(project_id=project.id, task_name=payload.task_name)
        db.add(task)
        db.commit()
        db.refresh(task)

        # Step C: Start the Result record
        res = TrainingResult(task_id=task.id, status="RUNNING")
        db.add(res)
        db.commit()
        db.refresh(res)

        # Step D: Run the DSPy/GEPA Evolution
        sig, state = stratos_logic.evolve_task(payload.data, payload.prompt)

        # Step E: Save successful state
        res.status = "SUCCESS"
        res.end_time = datetime.now(timezone.utc)
        res.signature = sig
        res.optimized_state = state
        db.commit()

        return {"id": res.id, "status": "COMPLETED"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) from e


# --- 2. THE DATA RETRIEVAL ENDPOINTS ---


@app.get("/v1/results/{result_id}", response_model=TrainingResultRead)
async def get_specific_result(result_id: str, db: Session = Depends(get_db)):
    """Fetch the final optimized prompt state for deployment."""
    try:
        rid = int(result_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid result_id")
    result = db.query(TrainingResult).filter(TrainingResult.id == rid).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        "id": result.id,
        "task_id": result.task_id,
        "status": result.status,
        "end_time": result.end_time,
        "signature": result.signature,
        "optimized_state": result.optimized_state,
    }
