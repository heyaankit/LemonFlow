
# Necessary Imports
from pydantic import BaseModel, Field
from datetime import datetime
from models import ProjectStatus, ArtifactType
from typing import Any, Optional


# Porject's Schema
class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=50, description="Project's name")
    description: Optional[str] = Field(None, description="Project's description")

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    status : ProjectStatus

    model_config = {
        "from_attributes": True
    }

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50, description="Project's name")
    description: Optional[str] = Field(None, description="Project's description")
    status: Optional[ProjectStatus] = Field(None, description="Project's status")


# Experiment's Schema
class ExperimentCreate(BaseModel):
    name: str = Field(..., max_length=50, description="Experiment's name")
    project_id: int = Field(..., ge=1, description="Of project's id")
    description: Optional[str] = Field(None, description="Experiment's description")

class ExperimentResponse(BaseModel):
    id: int
    name: str
    project_id: int
    description: Optional[str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class ExperimentUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50, description="Experiment's name")
    project_id: Optional[int] = Field(None, ge=1, description="Of project's id")
    description: Optional[str] = Field(None, max_length=50, description="Experiment's description")


# Run's Schema
class RunCreate(BaseModel):
    experiment_id: int = Field(..., ge=1, description="Of experiment's id")
    parameters: dict[str, Any] = Field(..., description="Various parameters")

class RunResponse(BaseModel):
    id: int
    experiment_id: int
    parameters: dict[str, Any]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class RunUpdate(BaseModel):
    experiment_id: Optional[int] = Field(None, ge=1, description="Of experiment's id")
    parameters: Optional[dict[str, Any]] = Field(None, description="Various parameters")


# Metric's Schema
class MetricCreate(BaseModel):
    run_id: int = Field(..., ge=1)
    name: str = Field(..., description='metric name')
    value: Optional[float | str] = Field(..., description='metric value')

class MetricResponse(BaseModel):
    id: int
    run_id: int
    name: str
    value: Optional[float | str]

    model_config = {
        "from_attributes": True
    }

class MetricUpdate(BaseModel):
    run_id: Optional[int] = Field(None, description="Of experiment's id")
    name: Optional[str] = Field(None, max_length=50, description="Metric's name")
    value: Optional[float | str] = Field(None, description="Metric's value")


# Artifact's Schema
class ArtifactCreate(BaseModel):
    metric_id: int = Field(..., ge=1, description="Of metric's id")
    file_path: Optional[str] = Field(None, description="File path")
    artifact_type: Optional[ArtifactType | str] = Field(None, description="Artifact type")

class ArtifactResponse(BaseModel):
    id: int
    metric_id: int
    file_path: Optional[str]
    artifact_type: Optional[ArtifactType | str]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class ArtifactUpdate(BaseModel):
    metric_id: Optional[int] = Field(None, description="Of metric's id")
    file_path: Optional[str] = Field(None, description="File path")
    artifact_type: Optional[ArtifactType | str] = Field(None, description="Artifact type")
    