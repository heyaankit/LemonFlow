// API Configuration and Services for ML Experiment Tracking System

import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  Experiment,
  ExperimentCreate,
  ExperimentUpdate,
  Run,
  RunCreate,
  RunUpdate,
  Metric,
  MetricCreate,
  MetricUpdate,
  Artifact,
  ArtifactCreate,
  ArtifactUpdate,
  DeleteResponse,
} from './types';

// Configure your FastAPI backend URL here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ==================== Projects API ====================
export const projectsApi = {
  list: () => apiRequest<Project[]>('/projects'),
  
  get: (id: number) => apiRequest<Project>(`/projects/${id}`),
  
  create: (data: ProjectCreate) => 
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: ProjectUpdate) =>
    apiRequest<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<DeleteResponse>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Experiments API ====================
export const experimentsApi = {
  list: () => apiRequest<Experiment[]>('/experiments'),
  
  get: (id: number) => apiRequest<Experiment>(`/experiment/${id}`),
  
  create: (data: ExperimentCreate) =>
    apiRequest<Experiment>('/experiments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: ExperimentUpdate) =>
    apiRequest<Experiment>(`/experiment/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<DeleteResponse>(`/experiments/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Runs API ====================
export const runsApi = {
  list: () => apiRequest<Run[]>('/runs'),
  
  get: (id: number) => apiRequest<Run>(`/runs/${id}`),
  
  create: (data: RunCreate) =>
    apiRequest<Run>('/runs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: RunUpdate) =>
    apiRequest<Run>(`/runs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<DeleteResponse>(`/runs/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Metrics API ====================
export const metricsApi = {
  list: () => apiRequest<Metric[]>('/metrics'),
  
  get: (id: number) => apiRequest<Metric>(`/metrics/${id}`),
  
  create: (data: MetricCreate) =>
    apiRequest<Metric>('/metrics', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: MetricUpdate) =>
    apiRequest<Metric>(`/metrics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<DeleteResponse>(`/metrics/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== Artifacts API ====================
export const artifactsApi = {
  list: () => apiRequest<Artifact[]>('/artifacts'),
  
  get: (id: number) => apiRequest<Artifact>(`/artifacts/${id}`),
  
  create: (data: ArtifactCreate) =>
    apiRequest<Artifact>('/artifacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: ArtifactUpdate) =>
    apiRequest<Artifact>(`/artifacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<DeleteResponse>(`/artifacts/${id}`, {
      method: 'DELETE',
    }),
};

export { API_BASE_URL };
