'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  projectsApi,
  experimentsApi,
  runsApi,
  metricsApi,
  artifactsApi,
  API_BASE_URL,
} from '@/lib/api';
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectStatus,
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
  ArtifactType,
} from '@/lib/types';

import {
  FlaskConical,
  FolderKanban,
  Play,
  Gauge,
  FileBox,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  Activity,
  Database,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// ==================== Status Badge Component ====================
function StatusBadge({ status }: { status: ProjectStatus }) {
  const variants: Record<ProjectStatus, string> = {
    Running: 'bg-blue-500 hover:bg-blue-600',
    Completed: 'bg-green-500 hover:bg-green-600',
    Failed: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <Badge className={`${variants[status]} text-white`}>
      {status}
    </Badge>
  );
}

// ==================== Artifact Type Badge Component ====================
function ArtifactTypeBadge({ type }: { type: ArtifactType | null }) {
  if (!type) return <Badge variant="outline">None</Badge>;

  const variants: Record<ArtifactType, string> = {
    Model: 'bg-purple-500 hover:bg-purple-600',
    Plot: 'bg-cyan-500 hover:bg-cyan-600',
    Log: 'bg-yellow-500 hover:bg-yellow-600',
    Dataset: 'bg-orange-500 hover:bg-orange-600',
    Config: 'bg-gray-500 hover:bg-gray-600',
    Checkpoint: 'bg-pink-500 hover:bg-pink-600',
  };

  return (
    <Badge className={`${variants[type]} text-white`}>
      {type}
    </Badge>
  );
}

// ==================== Projects Panel ====================
function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectCreate & ProjectUpdate>({
    name: '',
    description: '',
    status: undefined,
  });
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectsApi.list();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = () => {
    setSelectedProject(null);
    setFormData({ name: '', description: '' });
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedProject) {
        const updateData: ProjectUpdate = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.description !== undefined) updateData.description = formData.description;
        if (formData.status) updateData.status = formData.status;
        await projectsApi.update(selectedProject.id, updateData);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await projectsApi.create({ name: formData.name, description: formData.description });
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await projectsApi.delete(selectedProject.id);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      setDeleteDialogOpen(false);
      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Badge variant="secondary">{projects.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchProjects}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No projects yet</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono">{project.id}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {project.description || '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              {selectedProject
                ? 'Update the project details below.'
                : 'Fill in the details to create a new project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={3}
              />
            </div>
            {selectedProject && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value: ProjectStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name}>
              {selectedProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedProject?.name}&quot;? This will
              also delete all associated experiments, runs, metrics, and artifacts. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== Experiments Panel ====================
function ExperimentsPanel() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [formData, setFormData] = useState<ExperimentCreate & ExperimentUpdate>({
    name: '',
    project_id: 0,
    description: '',
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [experimentsData, projectsData] = await Promise.all([
        experimentsApi.list(),
        projectsApi.list(),
      ]);
      setExperiments(experimentsData);
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || 'Unknown';
  };

  const handleCreate = () => {
    setSelectedExperiment(null);
    setFormData({ name: '', project_id: projects[0]?.id || 0, description: '' });
    setDialogOpen(true);
  };

  const handleEdit = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setFormData({
      name: experiment.name,
      project_id: experiment.project_id,
      description: experiment.description || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedExperiment) {
        const updateData: ExperimentUpdate = {};
        if (formData.name) updateData.name = formData.name;
        if (formData.project_id) updateData.project_id = formData.project_id;
        if (formData.description !== undefined) updateData.description = formData.description;
        await experimentsApi.update(selectedExperiment.id, updateData);
        toast({ title: 'Success', description: 'Experiment updated successfully' });
      } else {
        await experimentsApi.create({
          name: formData.name,
          project_id: formData.project_id,
          description: formData.description,
        });
        toast({ title: 'Success', description: 'Experiment created successfully' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedExperiment) return;
    try {
      await experimentsApi.delete(selectedExperiment.id);
      toast({ title: 'Success', description: 'Experiment deleted successfully' });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Experiments</h3>
          <Badge variant="secondary">{experiments.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={projects.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            New Experiment
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Create a project first to add experiments</p>
          </CardContent>
        </Card>
      ) : experiments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No experiments yet</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create your first experiment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiments.map((experiment) => (
                <TableRow key={experiment.id}>
                  <TableCell className="font-mono">{experiment.id}</TableCell>
                  <TableCell className="font-medium">{experiment.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getProjectName(experiment.project_id)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {experiment.description || '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(experiment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(experiment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(experiment)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedExperiment ? 'Edit Experiment' : 'Create New Experiment'}
            </DialogTitle>
            <DialogDescription>
              {selectedExperiment
                ? 'Update the experiment details below.'
                : 'Fill in the details to create a new experiment.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Experiment name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.project_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, project_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Experiment description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.project_id}>
              {selectedExperiment ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experiment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedExperiment?.name}&quot;? This will
              also delete all associated runs, metrics, and artifacts. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== Runs Panel ====================
function RunsPanel() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [paramKey, setParamKey] = useState('');
  const [paramValue, setParamValue] = useState('');
  const [formData, setFormData] = useState<{
    experiment_id: number;
    parameters: Record<string, unknown>;
  }>({
    experiment_id: 0,
    parameters: {},
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [runsData, experimentsData] = await Promise.all([
        runsApi.list(),
        experimentsApi.list(),
      ]);
      setRuns(runsData);
      setExperiments(experimentsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getExperimentName = (experimentId: number) => {
    const experiment = experiments.find((e) => e.id === experimentId);
    return experiment?.name || 'Unknown';
  };

  const handleCreate = () => {
    setSelectedRun(null);
    setFormData({
      experiment_id: experiments[0]?.id || 0,
      parameters: {},
    });
    setParamKey('');
    setParamValue('');
    setDialogOpen(true);
  };

  const handleEdit = (run: Run) => {
    setSelectedRun(run);
    setFormData({
      experiment_id: run.experiment_id,
      parameters: { ...run.parameters },
    });
    setParamKey('');
    setParamValue('');
    setDialogOpen(true);
  };

  const handleDelete = (run: Run) => {
    setSelectedRun(run);
    setDeleteDialogOpen(true);
  };

  const addParameter = () => {
    if (paramKey && paramValue) {
      try {
        const parsedValue = JSON.parse(paramValue);
        setFormData({
          ...formData,
          parameters: { ...formData.parameters, [paramKey]: parsedValue },
        });
      } catch {
        setFormData({
          ...formData,
          parameters: { ...formData.parameters, [paramKey]: paramValue },
        });
      }
      setParamKey('');
      setParamValue('');
    }
  };

  const removeParameter = (key: string) => {
    const newParams = { ...formData.parameters };
    delete newParams[key];
    setFormData({ ...formData, parameters: newParams });
  };

  const handleSubmit = async () => {
    try {
      if (selectedRun) {
        await runsApi.update(selectedRun.id, {
          experiment_id: formData.experiment_id,
          parameters: formData.parameters,
        });
        toast({ title: 'Success', description: 'Run updated successfully' });
      } else {
        await runsApi.create({
          experiment_id: formData.experiment_id,
          parameters: formData.parameters,
        });
        toast({ title: 'Success', description: 'Run created successfully' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedRun) return;
    try {
      await runsApi.delete(selectedRun.id);
      toast({ title: 'Success', description: 'Run deleted successfully' });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Runs</h3>
          <Badge variant="secondary">{runs.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={experiments.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            New Run
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : experiments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Create an experiment first to add runs</p>
          </CardContent>
        </Card>
      ) : runs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No runs yet</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create your first run
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Experiment</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono">{run.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getExperimentName(run.experiment_id)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Object.entries(run.parameters).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}: {String(value).slice(0, 15)}
                        </Badge>
                      ))}
                      {Object.keys(run.parameters).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{Object.keys(run.parameters).length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(run.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(run)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(run)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRun ? 'Edit Run' : 'Create New Run'}</DialogTitle>
            <DialogDescription>
              {selectedRun
                ? 'Update the run details below.'
                : 'Fill in the details to create a new run.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="experiment">Experiment *</Label>
              <Select
                value={formData.experiment_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, experiment_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experiment" />
                </SelectTrigger>
                <SelectContent>
                  {experiments.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id.toString()}>
                      {exp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Parameters</Label>
              <div className="flex gap-2">
                <Input
                  value={paramKey}
                  onChange={(e) => setParamKey(e.target.value)}
                  placeholder="Key"
                  className="flex-1"
                />
                <Input
                  value={paramValue}
                  onChange={(e) => setParamValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button type="button" onClick={addParameter}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(formData.parameters).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    <span>
                      {key}: {JSON.stringify(value)}
                    </span>
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => removeParameter(key)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.experiment_id}>
              {selectedRun ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Run</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Run #{selectedRun?.id}? This will also delete
              all associated metrics and artifacts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== Metrics Panel ====================
function MetricsPanel() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [formData, setFormData] = useState<MetricCreate & MetricUpdate>({
    run_id: 0,
    name: '',
    value: '',
  });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [metricsData, runsData] = await Promise.all([
        metricsApi.list(),
        runsApi.list(),
      ]);
      setMetrics(metricsData);
      setRuns(runsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setSelectedMetric(null);
    setFormData({ run_id: runs[0]?.id || 0, name: '', value: '' });
    setDialogOpen(true);
  };

  const handleEdit = (metric: Metric) => {
    setSelectedMetric(metric);
    setFormData({
      run_id: metric.run_id,
      name: metric.name,
      value: metric.value,
    });
    setDialogOpen(true);
  };

  const handleDelete = (metric: Metric) => {
    setSelectedMetric(metric);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedMetric) {
        await metricsApi.update(selectedMetric.id, {
          run_id: formData.run_id,
          name: formData.name,
          value: formData.value,
        });
        toast({ title: 'Success', description: 'Metric updated successfully' });
      } else {
        await metricsApi.create({
          run_id: formData.run_id,
          name: formData.name,
          value: formData.value,
        });
        toast({ title: 'Success', description: 'Metric created successfully' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedMetric) return;
    try {
      await metricsApi.delete(selectedMetric.id);
      toast({ title: 'Success', description: 'Metric deleted successfully' });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Metrics</h3>
          <Badge variant="secondary">{metrics.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={runs.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            New Metric
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : runs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gauge className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Create a run first to add metrics</p>
          </CardContent>
        </Card>
      ) : metrics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gauge className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No metrics yet</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create your first metric
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Run ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell className="font-mono">{metric.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Run #{metric.run_id}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{metric.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {String(metric.value)}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(metric)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(metric)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMetric ? 'Edit Metric' : 'Create New Metric'}</DialogTitle>
            <DialogDescription>
              {selectedMetric
                ? 'Update the metric details below.'
                : 'Fill in the details to create a new metric.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="run">Run *</Label>
              <Select
                value={formData.run_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, run_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select run" />
                </SelectTrigger>
                <SelectContent>
                  {runs.map((run) => (
                    <SelectItem key={run.id} value={run.id.toString()}>
                      Run #{run.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., accuracy, loss, f1_score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={String(formData.value)}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., 0.95, 0.03, 'best'"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.run_id || !formData.name || formData.value === ''}
            >
              {selectedMetric ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metric</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete metric &quot;{selectedMetric?.name}&quot;? This
              will also delete all associated artifacts. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== Artifacts Panel ====================
function ArtifactsPanel() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [formData, setFormData] = useState<ArtifactCreate & ArtifactUpdate>({
    metric_id: 0,
    file_path: '',
    artifact_type: undefined,
  });
  const { toast } = useToast();

  const artifactTypes: ArtifactType[] = [
    'Model',
    'Plot',
    'Log',
    'Dataset',
    'Config',
    'Checkpoint',
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [artifactsData, metricsData] = await Promise.all([
        artifactsApi.list(),
        metricsApi.list(),
      ]);
      setArtifacts(artifactsData);
      setMetrics(metricsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setSelectedArtifact(null);
    setFormData({
      metric_id: metrics[0]?.id || 0,
      file_path: '',
      artifact_type: 'Model',
    });
    setDialogOpen(true);
  };

  const handleEdit = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setFormData({
      metric_id: artifact.metric_id,
      file_path: artifact.file_path || '',
      artifact_type: artifact.artifact_type || undefined,
    });
    setDialogOpen(true);
  };

  const handleDelete = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedArtifact) {
        await artifactsApi.update(selectedArtifact.id, {
          metric_id: formData.metric_id,
          file_path: formData.file_path,
          artifact_type: formData.artifact_type,
        });
        toast({ title: 'Success', description: 'Artifact updated successfully' });
      } else {
        await artifactsApi.create({
          metric_id: formData.metric_id,
          file_path: formData.file_path,
          artifact_type: formData.artifact_type,
        });
        toast({ title: 'Success', description: 'Artifact created successfully' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedArtifact) return;
    try {
      await artifactsApi.delete(selectedArtifact.id);
      toast({ title: 'Success', description: 'Artifact deleted successfully' });
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Artifacts</h3>
          <Badge variant="secondary">{artifacts.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={metrics.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            New Artifact
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : metrics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileBox className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Create a metric first to add artifacts</p>
          </CardContent>
        </Card>
      ) : artifacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileBox className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No artifacts yet</p>
            <Button className="mt-4" onClick={handleCreate}>
              Create your first artifact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Metric ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Path</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artifacts.map((artifact) => (
                <TableRow key={artifact.id}>
                  <TableCell className="font-mono">{artifact.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Metric #{artifact.metric_id}</Badge>
                  </TableCell>
                  <TableCell>
                    <ArtifactTypeBadge type={artifact.artifact_type} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-sm">
                    {artifact.file_path || '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(artifact.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(artifact)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(artifact)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedArtifact ? 'Edit Artifact' : 'Create New Artifact'}
            </DialogTitle>
            <DialogDescription>
              {selectedArtifact
                ? 'Update the artifact details below.'
                : 'Fill in the details to create a new artifact.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Metric *</Label>
              <Select
                value={formData.metric_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData({ ...formData, metric_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric.id} value={metric.id.toString()}>
                      Metric #{metric.id} - {metric.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Artifact Type</Label>
              <Select
                value={formData.artifact_type || ''}
                onValueChange={(value: ArtifactType) =>
                  setFormData({ ...formData, artifact_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {artifactTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_path">File Path</Label>
              <Input
                id="file_path"
                value={formData.file_path || ''}
                onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                placeholder="/path/to/artifact"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.metric_id}>
              {selectedArtifact ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artifact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Artifact #{selectedArtifact?.id}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ==================== Dashboard Overview ====================
function DashboardOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState({
    projects: 0,
    experiments: 0,
    runs: 0,
    metrics: 0,
    artifacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, experiments, runs, metrics, artifacts] = await Promise.all([
          projectsApi.list(),
          experimentsApi.list(),
          runsApi.list(),
          metricsApi.list(),
          artifactsApi.list(),
        ]);
        setStats({
          projects: projects.length,
          experiments: experiments.length,
          runs: runs.length,
          metrics: metrics.length,
          artifacts: artifacts.length,
        });
        setApiStatus('connected');
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setApiStatus('error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-blue-500' },
    { label: 'Experiments', value: stats.experiments, icon: FlaskConical, color: 'text-purple-500' },
    { label: 'Runs', value: stats.runs, icon: Play, color: 'text-green-500' },
    { label: 'Metrics', value: stats.metrics, icon: Gauge, color: 'text-orange-500' },
    { label: 'Artifacts', value: stats.artifacts, icon: FileBox, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* API Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            API Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {apiStatus === 'checking' && (
                <>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Checking connection...</span>
                </>
              )}
              {apiStatus === 'connected' && (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600">Connection Failed</span>
                </>
              )}
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onNavigate(stat.label.toLowerCase())}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common actions to manage your ML experiments</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate('projects')}
          >
            <FolderKanban className="h-6 w-6 text-blue-500" />
            <span>New Project</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate('experiments')}
          >
            <FlaskConical className="h-6 w-6 text-purple-500" />
            <span>New Experiment</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate('runs')}
          >
            <Play className="h-6 w-6 text-green-500" />
            <span>New Run</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => onNavigate('projects')}
          >
            <Database className="h-6 w-6 text-orange-500" />
            <span>View All Data</span>
          </Button>
        </CardContent>
      </Card>

      {/* Entity Relationship Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            Entity Hierarchy
          </CardTitle>
          <CardDescription>Understanding the ML Experiment Tracking structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" className="text-base py-1">
              Projects
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-base py-1">
              Experiments
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-base py-1">
              Runs
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-base py-1">
              Metrics
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-base py-1">
              Artifacts
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Each entity is linked hierarchically. Projects contain experiments, experiments contain
            runs, runs contain metrics, and metrics can have associated artifacts. When you delete
            a parent entity, all child entities are automatically deleted (cascade delete).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Main Page Component ====================
export default function MLExperimentTracker() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold">LemonFlow</h1>
                <p className="text-sm text-muted-foreground">ML Experiment Tracking System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={API_BASE_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  API Docs
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 py-2">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center gap-2 py-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Experiments</span>
            </TabsTrigger>
            <TabsTrigger value="runs" className="flex items-center gap-2 py-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Runs</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2 py-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex items-center gap-2 py-2">
              <FileBox className="h-4 w-4" />
              <span className="hidden sm:inline">Artifacts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview onNavigate={setActiveTab} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsPanel />
          </TabsContent>

          <TabsContent value="experiments">
            <ExperimentsPanel />
          </TabsContent>

          <TabsContent value="runs">
            <RunsPanel />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsPanel />
          </TabsContent>

          <TabsContent value="artifacts">
            <ArtifactsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              <span>LemonFlow - ML Experiment Tracker</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Connected to: {API_BASE_URL}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
