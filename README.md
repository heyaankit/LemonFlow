# LemonFlow (ML Experiment tracker)

<p align="center">
  <img src="frontend/public/logo.svg" alt="LemonFlow Logo" width="200" />
</p>

#### Live Demo

[![Open App](https://img.shields.io/badge/Open-App-brightgreen)](https://lemonflow-exgk.onrender.com)

⚠️ The app may take ~2 mins to wake up because it is hosted on Render free tier.


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

---

# Running the Project Locally

This repository contains a **FastAPI backend** and a **Next.js frontend**.
To run the full application locally, both services must be started separately.

---

## 1. Clone the Repository

First clone the repository and move into the project directory.

```bash
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>
```

---

# Backend Setup (FastAPI)

## 2. Create and Activate a Virtual Environment

**Windows**

```bash
python -m venv env
env\Scripts\activate
```

**Linux / macOS**

```bash
python3 -m venv env
source env/bin/activate
```

---

## 3. Install Backend Dependencies

Install all required Python packages.

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file in the root directory and configure the database connection.

Example:

```
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/database_name
```

Make sure PostgreSQL is installed and running locally.

---

## 5. Run the Backend Server

Start the FastAPI development server.

```bash
uvicorn main:app --reload
```

The backend will be available at:

```
http://127.0.0.1:8000
```

API documentation is available at:

```
http://127.0.0.1:8000/docs
```

---

# Frontend Setup (Next.js)

Open **a new terminal** and navigate to the frontend directory.

## 6. Move to the Frontend Folder

```bash
cd frontend
```

---

## 7. Install Node Dependencies

```bash
npm install
```

---

## 8. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:3000
```

---

# Running the Full Application

During development you should run **both services simultaneously**.

**Terminal 1 – Backend**

```bash
uvicorn main:app --reload
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

Then open the application in your browser:

```
http://localhost:3000
```

---

# Notes

* Ensure **PostgreSQL** is installed and accessible.
* Environment variables should be stored in a `.env` file and **must not be committed to Git**.
* The `.gitignore` file already excludes `.env`, datasets, and other non-essential files.
* If dependencies change, rerun `pip install -r requirements.txt` or `npm install`.
