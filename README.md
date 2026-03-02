# LemonFlow (ML Experiment tracker)

### Overview

This project is a lightweight Machine Learning Experiment Tracking System built with FastAPI and PostgreSQL. It allows you to manage projects, experiments, runs, metrics, and artifacts in a structured way, similiar in concept to MLFlow, but tailored for small-scale projects and learning purposes.

The System tracks:

- Projects: Top-level grouping of experiments.
- Experiments: Specific model development attempts under a project.
- Runs: Individual training executions with parameters, status, and timestamps.
- Metrics: Performance measurements for runs, stored flexibly.
- Artifacts: Files generated during experiments, like models, plots, and logs.

It is designed to be extendable so you can integrate ML models later and track results programmatically.

---

### Features

- CRUD operations for Projects, Experiments, Runs, Metrics and Artifacts.
- Strong relational schema using SQLAlchemy ORM with foreign keys and cascading deletes.
- Parameter logging using JSON fields for flexibility.
- Metric tracking per run, supporting time-series logging.
- Artifact management via file path references.
- ENUM-based fields via for controlled values like run status or artifact type. 

---

### Technology Stack 

- FastAPI: Web framework for building APIs.
- SQLAlchemy ORM: Database modelling and object-relational mapping.
- MySQL: Relational database backend.
- Pydantic: Data validation and serialization
- Python 3.12+

---

### Database Schema

Tables:

1. Projects – Stores project metadata (id, name, description, timestamps).
2. Experiments – Linked to projects; stores experiment metadata.
3. Runs – Linked to experiments; stores hyperparameters, status, timestamps.
4. Metrics – Linked to runs; stores metric name, value, optional step, timestamp.
5. Artifacts – Linked to metrics; stores file paths and artifact types.

---

### Future Enhancements

- Integration with ML model training scripts for automatic run logging.
- Dashboard for metrics visualization.
- Support for multiple users and authentication.
- Storage of artifacts in cloud (S3, GCS) instead of local paths.
- Advanced filtering and search on metrics and parameters.

