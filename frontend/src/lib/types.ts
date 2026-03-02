// ML Experiment Tracking System Types

// Project Types
export type ProjectStatus = 'Running' | 'Completed' | 'Failed';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  status: ProjectStatus;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// Experiment Types
export interface Experiment {
  id: number;
  name: string;
  project_id: number;
  description: string | null;
  created_at: string;
}

export interface ExperimentCreate {
  name: string;
  project_id: number;
  description?: string;
}

export interface ExperimentUpdate {
  name?: string;
  project_id?: number;
  description?: string;
}

// Run Types
export interface Run {
  id: number;
  experiment_id: number;
  parameters: Record<string, unknown>;
  created_at: string;
}

export interface RunCreate {
  experiment_id: number;
  parameters: Record<string, unknown>;
}

export interface RunUpdate {
  experiment_id?: number;
  parameters?: Record<string, unknown>;
}

// Metric Types
export interface Metric {
  id: number;
  run_id: number;
  name: string;
  value: number | string;
}

export interface MetricCreate {
  run_id: number;
  name: string;
  value: number | string;
}

export interface MetricUpdate {
  run_id?: number;
  name?: string;
  value?: number | string;
}

// Artifact Types
export type ArtifactType = 'Model' | 'Plot' | 'Log' | 'Dataset' | 'Config' | 'Checkpoint';

export interface Artifact {
  id: number;
  metric_id: number;
  file_path: string | null;
  artifact_type: ArtifactType | null;
  created_at: string;
}

export interface ArtifactCreate {
  metric_id: number;
  file_path?: string;
  artifact_type?: ArtifactType;
}

export interface ArtifactUpdate {
  metric_id?: number;
  file_path?: string;
  artifact_type?: ArtifactType;
}

// API Response Types
export interface DeleteResponse {
  message: string;
}
