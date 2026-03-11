<div align="center">

<img src="frontend/public/logo.svg" alt="LemonFlow Logo" width="180" />

# LemonFlow

**A Lightweight Machine Learning Experiment Tracker**

[![Open App](https://img.shields.io/badge/Open-App-brightgreen?style=for-the-badge)](https://lemonflow-exgk.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

⚠️ The app may take ~2 mins to wake up because it is hosted on Render free tier.

</div>

---

## Overview

LemonFlow is a lightweight, open-source Machine Learning Experiment Tracking System designed for small-scale projects, learning purposes, and teams who need a simple yet powerful way to organize their ML workflows. Built with modern technologies like FastAPI and Next.js, it provides a clean interface to manage your ML experiments without the complexity of enterprise solutions.

### What LemonFlow Tracks

| Entity | Description |
|--------|-------------|
| Projects | Top-level containers for organizing related experiments |
| Experiments | Specific model development attempts within a project |
| Runs | Individual training executions with parameters, status, and timestamps |
| Metrics | Performance measurements for runs with time-series support |
| Artifacts | Generated files like models, plots, and logs |

---

## Features

- Full CRUD Operations for Projects, Experiments, Runs, Metrics, and Artifacts
- Relational Data Integrity using SQLAlchemy ORM with foreign keys and cascading deletes
- Flexible Parameter Logging using JSON fields for storing arbitrary hyperparameters
- Time-Series Metrics tracking with timestamps
- Artifact Management with file path references
- ENUM-Based Fields for controlled values like run status and artifact types
- Modern Dashboard with clean, responsive UI built with Next.js and shadcn/ui

---

## Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance Python web framework for building APIs |
| SQLAlchemy | Python SQL toolkit and Object-Relational Mapping |
| PostgreSQL | Powerful, open-source relational database |
| Pydantic | Data validation and settings management |
| Python 3.12+ | Modern Python with latest features |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework for production |
| Tailwind CSS | Utility-first CSS framework |
| shadcn/ui | Beautiful, accessible React components |
| Recharts | Composable charting library built on React |
| TypeScript | Type-safe JavaScript |

---

## Database Schema

Tables:

1. **Projects** - Stores project metadata (id, name, description, created_at, updated_at)
2. **Experiments** - Linked to projects; stores experiment metadata and configuration
3. **Runs** - Linked to experiments; stores hyperparameters (JSON), status, timestamps
4. **Metrics** - Linked to runs; stores metric name, value, optional step, timestamp
5. **Artifacts** - Linked to runs; stores file paths and artifact types (model, plot, log, other)

---

## Screenshots

### Dashboard Overview

<img src="app-images/dashboard.png" alt="Dashboard" width="100%" />

### Experiments List

<img src="app-images/experiments_list.png" alt="Experiments List" width="100%" />

[View all screenshots in the app-images directory](./app-images/)

---

## Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.12+ - [Download Python](https://python.org/downloads/)
- Node.js 18+ - [Download Node.js](https://nodejs.org/)
- PostgreSQL - [Download PostgreSQL](https://postgresql.org/download/)
- npm (comes with Node.js)

---

## Backend Setup (FastAPI)

### 1. Clone the Repository

```bash
git clone https://github.com/heyaankit/LemonFlow.git
cd LemonFlow
```

### 2. Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv env
env\Scripts\activate
```

**Linux / macOS:**
```bash
python3 -m venv env
source env/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/database_name
```

Make sure PostgreSQL is installed and running locally before proceeding.

### 5. Start the Backend Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

API documentation is available at `http://127.0.0.1:8000/docs`

---

## Frontend Setup (Next.js)

The frontend is built with Node.js. Make sure you have Node.js installed before proceeding.

### 6. Navigate to Frontend Directory

Open a new terminal window:

```bash
cd frontend
```

### 7. Install Node Dependencies

```bash
npm install
```

### 8. Build for Production

```bash
npm run build
```

### 9. Start the Application

**For Development:**
```bash
npm run dev
```

**For Production:**
```bash
npm start
```

The frontend will run at `http://localhost:3000`

---

## How to Use This Repository

### Running the Full Application

To run LemonFlow locally, you need to start both services simultaneously in separate terminals:

| Terminal | Command | Service |
|----------|---------|---------|
| Terminal 1 | `uvicorn main:app --reload` | Backend API (Port 8000) |
| Terminal 2 | `cd frontend && npm run dev` | Frontend UI (Port 3000) |

### Quick Command Reference

```bash
# Backend Commands
pip install -r requirements.txt    # Install Python dependencies
uvicorn main:app --reload          # Start development server

# Frontend Commands
cd frontend                        # Navigate to frontend folder
npm install                        # Install Node dependencies
npm run dev                        # Start development server
npm run build                      # Build for production
npm start                          # Start production server
```

### Development Workflow

1. Start PostgreSQL - Ensure your database is running
2. Start Backend - Run `uvicorn main:app --reload`
3. Start Frontend - Run `npm run dev` in the frontend directory
4. Open Browser - Navigate to `http://localhost:3000`

---

## API Documentation

Once the backend is running, access the interactive API documentation:

| Endpoint | Description |
|----------|-------------|
| `/docs` | Swagger UI interactive documentation |
| `/redoc` | ReDoc alternative documentation |
| `/openapi.json` | OpenAPI specification |

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/` | List all projects |
| POST | `/projects/` | Create a new project |
| GET | `/experiments/` | List all experiments |
| POST | `/experiments/` | Create a new experiment |
| GET | `/runs/` | List all runs |
| POST | `/runs/` | Create a new run |
| GET | `/metrics/` | List all metrics |
| POST | `/metrics/` | Log a new metric |
| GET | `/artifacts/` | List all artifacts |
| POST | `/artifacts/` | Register a new artifact |

---

## Future Enhancements

- ML Framework Integration - Automatic logging from PyTorch, TensorFlow, scikit-learn
- Advanced Dashboard - Interactive charts and visualizations for metrics
- User Authentication - Multi-user support with role-based access
- Cloud Storage - S3, GCS integration for artifact storage
- Advanced Search - Filter and search across experiments, runs, and metrics
- Notifications - Alerts for run completion and status changes
- Model Registry - Version control for trained models

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Notes

- Ensure PostgreSQL is installed and accessible
- Environment variables should be stored in `.env` file - never commit to Git
- The `.gitignore` file excludes `.env`, datasets, and other non-essential files
- If dependencies change, rerun `pip install -r requirements.txt` or `npm install`

---

<div align="center">

Made by [Ankit](https://github.com/heyaankit)

</div>
