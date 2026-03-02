
# Necessary imports
from fastapi import FastAPI, Depends, status, HTTPException
from typing import Optional, Annotated, List
from database import engine, SessionLocal
from sqlalchemy.orm import Session
import models
from schemas import *

from fastapi.middleware.cors import CORSMiddleware

# Creating an instance of Local session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Creating session dependency
db_dependency = Annotated[Session, Depends(get_db)]

# Creating an instance of fastapi
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mapping the created models to the database to create an actual database.
models.Base.metadata.create_all(bind=engine)

# Home API
@app.get('/')
def index():
    return {'Message': 'Welcome to the draft'}

# ------------------------------Operations on Projects table-----------------------------------------

# List all projects
@app.get('/projects', status_code=status.HTTP_200_OK, response_model=List[ProjectResponse])
async def list_projects(db: db_dependency):
    db_projects = db.query(models.Project).all()
    return db_projects
    
# Create a new project
@app.post('/projects', status_code=status.HTTP_201_CREATED, response_model=ProjectResponse)
async def create_project(project: ProjectCreate, db: db_dependency):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# View a project status by it's id
@app.get('/projects/{id}', status_code=status.HTTP_200_OK, response_model=ProjectResponse)
async def get_project(id: int, db: db_dependency):
    db_project = db.query(models.Project).filter(models.Project.id == id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail='Project not found!')
    return db_project

# Update any existing project
@app.patch('/projects/{id}', status_code=status.HTTP_200_OK, response_model=ProjectResponse)
async def update_project(id: int, project: ProjectUpdate, db: db_dependency):
    db_project = db.query(models.Project).filter(models.Project.id == id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail='Project not found!')
    
    update_data = project.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_project, key, value)

    db.commit()
    db.refresh(db_project)
    return db_project

# Delete a project
@app.delete('/projects/{id}', status_code=status.HTTP_200_OK)
async def delete_project(id: int, db: db_dependency):
    db_project = db.query(models.Project).filter(models.Project.id == id).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail='Project not found!')
    db.delete(db_project)
    db.commit()
    return {'message' : f'Your project with an id: {id} got deleted successfully!'}

# --------------------------------Operations on Experiments table-------------------------------------

# List all experiments
@app.get('/experiments', status_code=status.HTTP_200_OK, response_model=List[ExperimentResponse])
async def list_experiments(db: db_dependency):
    db_experiments = db.query(models.Experiment).all()
    return db_experiments
    
# Create a new experiment
@app.post('/experiments', status_code=status.HTTP_201_CREATED, response_model=ExperimentResponse)
async def create_experiment(experiment: ExperimentCreate, db: db_dependency):
    db_experiment = models.Experiment(**experiment.model_dump())
    db.add(db_experiment)
    db.commit()
    db.refresh(db_experiment)
    return db_experiment
     
# Get an experiment by it's id
@app.get('/experiment/{id}', status_code=status.HTTP_200_OK, response_model=ExperimentResponse)
async def get_experiment(id: int, db: db_dependency):
    db_experiment = db.query(models.Experiment).filter(models.Experiment.id == id).first()
    if db_experiment is None:
        raise HTTPException(status_code=404, detail="Experiement not found!")
    return db_experiment

# Update any existing experiment
@app.patch('/experiment/{id}', status_code=status.HTTP_200_OK, response_model=ExperimentResponse)
async def update_experiment(id: int, experiment: ExperimentUpdate, db: db_dependency):
    db_experiment = db.query(models.Experiment).filter(models.Experiment.id == id).first()
    if db_experiment is None:
        raise HTTPException(status_code=404, detail="Experiment not found!")
    
    update_data = experiment.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_experiment, key, value)

    db.commit()
    db.refresh(db_experiment)
    return db_experiment

# Delete an experiment
@app.delete('/experiments/{id}', status_code=status.HTTP_200_OK)
async def delete_experiment(id: int, db: db_dependency):
    db_experiment = db.query(models.Experiment).filter(models.Experiment.id == id).first()
    if db_experiment is None:
        raise HTTPException(status_code=404, detail="Experiment not found!")
    db.delete(db_experiment)
    db.commit()
    return {'mesage': f'Your experiment with an id: {id} got deleted successfully!'}


# ----------------------------------------Operations on Runs table--------------------------------------

# Lists all the runs 
@app.get('/runs', status_code=status.HTTP_200_OK, response_model=List[RunResponse])
async def list_runs(db: db_dependency):
    db_runs = db.query(models.Run).all()
    return db_runs

# Create a new run 
@app.post('/runs', status_code=status.HTTP_201_CREATED, response_model=RunResponse)
async def create_run(run: RunCreate, db:db_dependency):
    db_run = models.Run(**run.model_dump())
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

# View a run by it's id
@app.get('/runs/{id}', status_code=status.HTTP_200_OK, response_model=RunResponse)
async def get_run(id: int, db: db_dependency):
    db_run = db.query(models.Run).filter(models.Run.id == id).first()
    if db_run is None:
        raise HTTPException(status_code=404, detail="Run not found!")
    return db_run

# Update any existing run
@app.patch('/runs/{id}', status_code=status.HTTP_200_OK, response_model=RunResponse)
async def update(id: int, run: RunUpdate, db: db_dependency):
    db_run = db.query(models.Run).filter(models.Run.id == id).first()
    if db_run is None:
        raise HTTPException(status_code=404, detail="Run not found!")
    
    update_data = run.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_run, key, value)
    
    db.commit()
    db.refresh(db_run)
    return db_run

# Delete a run
@app.delete('/runs/{id}', status_code=status.HTTP_200_OK)
async def delete_run(id: int, db: db_dependency):
    db_run = db.query(models.Run).filter(models.Run.id == id).first()
    if db_run is None:
        raise HTTPException(status_code=404, detail="Run not found!")
    db.delete(db_run)
    db.commit()
    return {'message': f'Your run wtih an id: {id} got deleted successfully!'}

# -----------------------------------Operations on Metrics table---------------------------------------

# Lists all the metrics 
@app.get('/metrics', status_code=status.HTTP_200_OK, response_model=List[MetricResponse])
async def list_metrics(db: db_dependency):
    db_metrics = db.query(models.Metric).all()
    return db_metrics

# Create a new metrics
@app.post('/metrics', status_code=status.HTTP_201_CREATED, response_model=MetricResponse)
async def create_metric(metric: MetricCreate, db: db_dependency):
    db_metric = models.Metric(**metric.model_dump())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

# View a metric by it's id
@app.get('/metrics/{id}', status_code=status.HTTP_200_OK, response_model=MetricResponse)
async def get_metric(id: int, db: db_dependency):
    db_metric = db.query(models.Metric).filter(models.Metric.id == id).first()
    if db_metric is None:
        raise HTTPException(status_code=404, detail="Metric not found!")
    return db_metric

# Updating an existing metric
@app.patch('/metrics/{id}', status_code=status.HTTP_200_OK, response_model=MetricResponse)
async def update_metric(id: int, metric: MetricUpdate, db: db_dependency):
    db_metric = db.query(models.Metric).filter(models.Metric.id == id).first()
    if db_metric is None:
        raise HTTPException(status_code=404, detail="Metric not found!")
    
    update_data = metric.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_metric, key, value)
    
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

# Deleting a metric
@app.delete('/metrics/{id}', status_code=status.HTTP_200_OK)
async def delete_metric(id: int, db: db_dependency):
    db_metric = db.query(models.Metric).filter(models.Metric.id == id).first()
    if db_metric is None:
        raise HTTPException(status_code=404, detail="Metric not found!")
    db.delete(db_metric)
    db.commit()
    return {'message': f'Metric with an id: {id} got deleted successfully!'}

    
# ----------------------------------Operations on Artifacts table--------------------------------------

# Lists all artifacts
@app.get('/artifacts', status_code=status.HTTP_200_OK, response_model=List[ArtifactResponse])
async def list_artifacts(db: db_dependency):
    db_artifacts = db.query(models.Artifact).all()
    return db_artifacts

# Create a new artifact
@app.post('/artifacts', status_code=status.HTTP_201_CREATED, response_model=ArtifactResponse)
async def create_artifact(artifact: ArtifactCreate, db: db_dependency):
    db_artifact = models.Artifact(**artifact.model_dump())
    db.add(db_artifact)
    db.commit()
    db.refresh(db_artifact)
    return db_artifact

# View an artifact by it's id
@app.get('/artifacts/{id}', status_code=status.HTTP_200_OK, response_model=ArtifactResponse)
async def get_artifact(id: int, db: db_dependency):
    db_artifact = db.query(models.Artifact).filter(models.Artifact.id == id).filter()
    if db_artifact is None:
        raise HTTPException(status_code=404, detail="Artifact not found!")
    return db_artifact

# Update an existing artifact
@app.patch('/artifacts/{id}', status_code=status.HTTP_200_OK, response_model=ArtifactResponse)
async def update_artifact(id: int, artifact: ArtifactUpdate, db: db_dependency):
    db_artifact = db.query(models.Artifact).filter(models.Artifact.id == id).first()
    if db_artifact is None:
        raise HTTPException(status_code=404, detail="Artifact not found!")

    update_data = artifact.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_artifact, key, value)
    
    db.commit()
    db.refresh(db_artifact)
    return db_artifact

# Delete an artifact
@app.delete('/artifacts/{id}', status_code=status.HTTP_200_OK)
async def delete_artifact(id: int, db: db_dependency):
    db_artifact = db.query(models.Artifact).filter(models.Artifact.id == id).first()
    if db_artifact is None:
        raise HTTPException(status_code=404, detail="Artifact not found!")
    db.delete(db_artifact)
    db.commit()
    return {'message': f'Artifact with an id: {id} got deleted successfully!'}

