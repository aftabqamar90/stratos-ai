from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Project, ProjectTraining
from app.schemas import ProjectTrainingDeleteResponse, ProjectTrainingRead, ProjectTrainingWrite

router = APIRouter(prefix="/v1/project-trainings", tags=["project-trainings"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _normalize_name(raw_name: str) -> str:
    return raw_name.strip()


def _parse_project_training_id(project_training_id: str) -> int:
    try:
        return int(project_training_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project_training_id") from exc


def _project_exists(db: Session, project_id: int) -> bool:
    return db.query(Project).filter(Project.id == project_id).first() is not None


def _name_exists(
    db: Session,
    project_id: int,
    name: str,
    exclude_project_training_id: int | None = None,
) -> bool:
    query = db.query(ProjectTraining).filter(
        ProjectTraining.project_id == project_id,
        func.lower(ProjectTraining.name) == name.lower(),
    )
    if exclude_project_training_id is not None:
        query = query.filter(ProjectTraining.id != exclude_project_training_id)
    return query.first() is not None


@router.post("", response_model=ProjectTrainingRead)
async def create_project_training(payload: ProjectTrainingWrite, db: Session = Depends(get_db)):
    name = _normalize_name(payload.name)
    if not name:
        raise HTTPException(status_code=422, detail="Project training name is required")
    if not _project_exists(db, payload.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    if _name_exists(db, payload.project_id, name):
        raise HTTPException(status_code=409, detail="Project training name already exists for this project")

    project_training = ProjectTraining(project_id=payload.project_id, name=name)
    db.add(project_training)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Project training name already exists for this project",
        ) from exc

    db.refresh(project_training)
    return {"id": project_training.id, "project_id": project_training.project_id, "name": project_training.name}


@router.get("", response_model=list[ProjectTrainingRead])
async def list_project_trainings(db: Session = Depends(get_db)):
    rows = db.query(ProjectTraining).all()
    return [{"id": row.id, "project_id": row.project_id, "name": row.name} for row in rows]


@router.get("/{project_training_id}", response_model=ProjectTrainingRead)
async def get_project_training(project_training_id: str, db: Session = Depends(get_db)):
    ptid = _parse_project_training_id(project_training_id)
    row = db.query(ProjectTraining).filter(ProjectTraining.id == ptid).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project training not found")
    return {"id": row.id, "project_id": row.project_id, "name": row.name}


def _update_project_training(project_training_id: str, payload: ProjectTrainingWrite, db: Session):
    ptid = _parse_project_training_id(project_training_id)
    row = db.query(ProjectTraining).filter(ProjectTraining.id == ptid).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project training not found")

    name = _normalize_name(payload.name)
    if not name:
        raise HTTPException(status_code=422, detail="Project training name is required")
    if not _project_exists(db, payload.project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    if _name_exists(db, payload.project_id, name, exclude_project_training_id=row.id):
        raise HTTPException(status_code=409, detail="Project training name already exists for this project")

    row.project_id = payload.project_id
    row.name = name
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Project training name already exists for this project",
        ) from exc
    db.refresh(row)
    return {"id": row.id, "project_id": row.project_id, "name": row.name}


@router.put("/{project_training_id}", response_model=ProjectTrainingRead)
async def update_project_training(
    project_training_id: str,
    payload: ProjectTrainingWrite,
    db: Session = Depends(get_db),
):
    return _update_project_training(project_training_id, payload, db)


@router.patch("/{project_training_id}", response_model=ProjectTrainingRead)
async def patch_project_training(
    project_training_id: str,
    payload: ProjectTrainingWrite,
    db: Session = Depends(get_db),
):
    return _update_project_training(project_training_id, payload, db)


@router.delete("/{project_training_id}", response_model=ProjectTrainingDeleteResponse)
async def delete_project_training(project_training_id: str, db: Session = Depends(get_db)):
    ptid = _parse_project_training_id(project_training_id)
    row = db.query(ProjectTraining).filter(ProjectTraining.id == ptid).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project training not found")

    db.delete(row)
    db.commit()
    return {"id": ptid, "deleted": True}
