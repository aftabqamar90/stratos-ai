from pydantic import BaseModel, Field
from typing import Any
from datetime import datetime


class ProjectWrite(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Unique project name")


class ProjectRead(BaseModel):
    id: int
    name: str


class ProjectDeleteResponse(BaseModel):
    id: int
    deleted: bool


class ProjectTrainingWrite(BaseModel):
    project_id: int
    name: str = Field(..., min_length=1, max_length=255, description="Unique training name within project")


class ProjectTrainingRead(BaseModel):
    id: int
    project_id: int
    name: str


class ProjectTrainingDeleteResponse(BaseModel):
    id: int
    deleted: bool


class TrainRequest(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=255)
    task_name: str = Field(..., min_length=1, max_length=255)
    prompt: str = Field(..., min_length=1)
    data: Any


class TrainResponse(BaseModel):
    id: int
    status: str


class TrainingResultRead(BaseModel):
    id: int
    task_id: int
    status: str
    end_time: datetime | None = None
    signature: str | None = None
    optimized_state: Any = None


class ProjectTaskHistory(BaseModel):
    id: int
    project_id: int
    task_name: str
    results: list[TrainingResultRead]
