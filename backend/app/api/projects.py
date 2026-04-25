from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.database import SessionLocal
from app.models import Project, TrainingTask
from app.schemas import ProjectDeleteResponse, ProjectRead, ProjectTaskHistory, ProjectWrite

router = APIRouter(prefix="/v1/projects", tags=["projects"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _normalize_name(raw_name: str) -> str:
    return raw_name.strip()


def _parse_project_id(project_id: str) -> int:
    try:
        return int(project_id)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Invalid project_id") from exc


def _name_exists(db: Session, name: str, exclude_project_id: int | None = None) -> bool:
    query = db.query(Project).filter(Project.name == name)
    if exclude_project_id is not None:
        query = query.filter(Project.id != exclude_project_id)
    return query.first() is not None


@router.post("", response_model=ProjectRead)
async def create_project(payload: ProjectWrite, db: Session = Depends(get_db)):
    name = _normalize_name(payload.name)
    if not name:
        raise HTTPException(status_code=422, detail="Project name is required")
    if _name_exists(db, name):
        raise HTTPException(status_code=409, detail="Project name already exists")

    project = Project(name=name)
    db.add(project)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Project name already exists") from exc

    db.refresh(project)
    return {"id": project.id, "name": project.name}


@router.get("", response_model=list[ProjectRead])
async def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [{"id": p.id, "name": p.name} for p in projects]


@router.get("/{project_id}", response_model=ProjectRead)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    pid = _parse_project_id(project_id)
    project = db.query(Project).filter(Project.id == pid).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"id": project.id, "name": project.name}


def _update_project_name(project_id: str, payload: ProjectWrite, db: Session):
    pid = _parse_project_id(project_id)
    project = db.query(Project).filter(Project.id == pid).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    name = _normalize_name(payload.name)
    if not name:
        raise HTTPException(status_code=422, detail="Project name is required")
    if _name_exists(db, name, exclude_project_id=project.id):
        raise HTTPException(status_code=409, detail="Project name already exists")

    project.name = name
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Project name already exists") from exc

    db.refresh(project)
    return {"id": project.id, "name": project.name}


@router.put("/{project_id}", response_model=ProjectRead)
async def update_project(project_id: str, payload: ProjectWrite, db: Session = Depends(get_db)):
    return _update_project_name(project_id, payload, db)


@router.patch("/{project_id}", response_model=ProjectRead)
async def patch_project(project_id: str, payload: ProjectWrite, db: Session = Depends(get_db)):
    return _update_project_name(project_id, payload, db)


@router.delete("/{project_id}", response_model=ProjectDeleteResponse)
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    pid = _parse_project_id(project_id)
    project = db.query(Project).filter(Project.id == pid).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    has_tasks = db.query(TrainingTask).filter(TrainingTask.project_id == pid).first() is not None
    if has_tasks:
        raise HTTPException(
            status_code=409,
            detail="Cannot delete project with training history",
        )

    db.delete(project)
    db.commit()
    return {"id": pid, "deleted": True}


@router.get("/{project_id}/history", response_model=list[ProjectTaskHistory])
async def get_project_history(project_id: str, db: Session = Depends(get_db)):
    pid = _parse_project_id(project_id)
    tasks = (
        db.query(TrainingTask)
        .options(selectinload(TrainingTask.results))
        .filter(TrainingTask.project_id == pid)
        .all()
    )
    out = []
    for task in tasks:
        out.append(
            {
                "id": task.id,
                "project_id": task.project_id,
                "task_name": task.task_name,
                "results": [
                    {
                        "id": result.id,
                        "task_id": result.task_id,
                        "status": result.status,
                        "end_time": result.end_time,
                        "signature": result.signature,
                        "optimized_state": result.optimized_state,
                    }
                    for result in task.results
                ],
            }
        )
    return out
