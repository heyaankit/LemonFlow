
# necessary imports
from sqlalchemy import Boolean, Column, String, Integer, Float, DateTime, ForeignKey, Enum, JSON
from database import Base
from datetime import datetime
import enum
from sqlalchemy.orm import relationship

# Projects table
class ProjectStatus(str, enum.Enum):
    running = 'Running'
    completed = 'Completed'
    failed = 'Failed'

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    description = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.running)
    experiments = relationship('Experiment', back_populates='project', cascade='all, delete-orphan')

# Experiments Table
class Experiment(Base):
    __tablename__ = 'experiments'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False, index=True)
    description = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    project = relationship('Project', back_populates='experiments')
    runs = relationship('Run', back_populates='experiment', cascade='all, delete-orphan')

# Runs Table
class Run(Base):
    __tablename__ = 'runs'

    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey('experiments.id'), nullable=False, index=True)
    parameters = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    experiment = relationship('Experiment', back_populates='runs')
    metrics = relationship('Metric', back_populates='run', cascade='all, delete-orphan')


# Metrics Table
class Metric(Base):
    __tablename__ = 'metrics'

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey('runs.id'), index=True)
    name = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    run = relationship('Run', back_populates='metrics')
    artifacts = relationship('Artifact', back_populates='metric', cascade='all, delete-orphan')


# Artifacts Table
class ArtifactType(str, enum.Enum):
    model = 'Model'
    plot = 'Plot'
    log = 'Log'
    dataset = 'Dataset'
    config = 'Config'
    checkpoint = 'Checkpoint'

class Artifact(Base):
    __tablename__ = 'artifacts'

    id = Column(Integer, primary_key=True, index=True)
    metric_id = Column(Integer, ForeignKey('metrics.id'), index=True)
    file_path = Column(String(500), nullable=False)
    artifact_type = Column(Enum(ArtifactType), nullable=False, default=ArtifactType.model)
    created_at = Column(DateTime, default=datetime.utcnow)
    metric = relationship('Metric', back_populates='artifacts')
    


