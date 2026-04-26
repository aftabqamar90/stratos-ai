import json
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import dspy_solver
from app.core.engine import StratosEngine
from app.database import SessionLocal
from app.models import ProjectTraining, ProjectTrainingResult
from app.schemas import ProjectTrainingResultCreate, ProjectTrainingResultRead

router = APIRouter(prefix="/v1/project-training-results", tags=["project-training-results"])

_stratos_engine = StratosEngine(api_key=os.getenv("OPENROUTER_API_KEY"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _parse_project_training_result_id(project_training_result_id: str) -> int:
    try:
        return int(project_training_result_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project_training_result_id") from exc


def _project_training_exists(db: Session, project_training_id: int) -> bool:
    return db.query(ProjectTraining).filter(ProjectTraining.id == project_training_id).first() is not None


def _generate_basic_prompt(prompt: str, training_json: list[dict]) -> str:
    if dspy_solver.prompt_evolver is None:
        raise HTTPException(status_code=500, detail="dspy is not installed in backend environment")

    configure_fn = getattr(dspy_solver, "_configure_dspy_from_env", None)
    if configure_fn is None:
        raise HTTPException(status_code=500, detail="DSPy configuration is unavailable")

    openrouter_api_key = configure_fn()
    if not openrouter_api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set")

    try:
        updated_prompt = dspy_solver.prompt_evolver(prompt=prompt, training_json=training_json)
        return str(updated_prompt)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def _run_gepa(prompt: str, training_json: list[dict]) -> str:
    try:
        signature, state = _stratos_engine.evolve_task(training_json, prompt)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return json.dumps({"signature": signature, "state": state}, ensure_ascii=True)


@router.post(
    "",
    response_model=ProjectTrainingResultRead,
    summary="Create project training result",
    description=(
        "Creates a new training result record by running DSPy prompt generation first, then GEPA optimization.\n\n"
        "Required request body fields:\n"
        "- `project_training_id` (int): existing project training id\n"
        "- `prompt` (string): base prompt to optimize\n"
        "- `training_json` (array): training records; each record must include non-empty `result`\n\n"
        "Example body:\n"
        "{\n"
        '  "project_training_id": 1,\n'
        '  "prompt": "Write a short response",\n'
        '  "training_json": [{"input": "Hello", "result": "Hi there"}]\n'
        "}"
    ),
)
async def create_project_training_result(payload: ProjectTrainingResultCreate, db: Session = Depends(get_db)):
    # Validate FK existence before any training operation starts.
    if not _project_training_exists(db, payload.project_training_id):
        raise HTTPException(status_code=404, detail="Project training not found")

    start_date_time = datetime.now(timezone.utc)

    training_dspy_result = _generate_basic_prompt(
        prompt=payload.prompt,
        training_json=payload.training_json,
    )
    training_gepa_result = _run_gepa(prompt=training_dspy_result, training_json=payload.training_json)
    end_date_time = datetime.now(timezone.utc)

    row = ProjectTrainingResult(
        project_training_id=payload.project_training_id,
        training_data=json.dumps(payload.training_json, ensure_ascii=True),
        training_dspy_result=training_dspy_result,
        training_gepa_result=training_gepa_result,
        start_date_time=start_date_time,
        end_date_time=end_date_time,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "id": row.id,
        "project_training_id": row.project_training_id,
        "training_data": row.training_data,
        "training_dspy_result": row.training_dspy_result,
        "training_gepa_result": row.training_gepa_result,
        "start_date_time": row.start_date_time,
        "end_date_time": row.end_date_time,
    }


@router.get("", response_model=list[ProjectTrainingResultRead])
async def list_project_training_results(db: Session = Depends(get_db)):
    rows = db.query(ProjectTrainingResult).all()
    return [
        {
            "id": row.id,
            "project_training_id": row.project_training_id,
            "training_data": row.training_data,
            "training_dspy_result": row.training_dspy_result,
            "training_gepa_result": row.training_gepa_result,
            "start_date_time": row.start_date_time,
            "end_date_time": row.end_date_time,
        }
        for row in rows
    ]


@router.get("/{project_training_result_id}", response_model=ProjectTrainingResultRead)
async def get_project_training_result(project_training_result_id: str, db: Session = Depends(get_db)):
    ptrid = _parse_project_training_result_id(project_training_result_id)
    row = db.query(ProjectTrainingResult).filter(ProjectTrainingResult.id == ptrid).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project training result not found")
    return {
        "id": row.id,
        "project_training_id": row.project_training_id,
        "training_data": row.training_data,
        "training_dspy_result": row.training_dspy_result,
        "training_gepa_result": row.training_gepa_result,
        "start_date_time": row.start_date_time,
        "end_date_time": row.end_date_time,
    }
