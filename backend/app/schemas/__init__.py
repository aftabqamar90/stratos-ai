from pydantic import BaseModel, Field, field_validator
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


class ProjectTrainingResultCreate(BaseModel):
    project_training_id: int
    prompt: str = Field(..., min_length=1, description="Basic prompt to optimize")
    training_json: list[dict[str, Any]] = Field(
        ...,
        min_length=1,
        description="Training examples. Every record must include a non-empty 'result' field.",
    )

    @field_validator("training_json")
    @classmethod
    def validate_training_json_result(cls, value: list[dict[str, Any]]) -> list[dict[str, Any]]:
        for idx, item in enumerate(value):
            raw_result = item.get("result")
            if raw_result is None or not str(raw_result).strip():
                raise ValueError(f"training_json[{idx}].result is required")
        return value


class ProjectTrainingResultRead(BaseModel):
    id: int
    project_training_id: int
    training_data: str | None = None
    training_dspy_result: str | None = None
    training_gepa_result: str | None = None
    start_date_time: datetime | None = None
    end_date_time: datetime | None = None


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


class DspySolveRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The specific prompt or task to execute")
    training_json: list[dict[str, Any]] = Field(
        ...,
        description="JSON context or examples for the task",
    )


class DspySolveResponse(BaseModel):
    answer: str


class DspyEvolvePromptResponse(BaseModel):
    updated_prompt: str
