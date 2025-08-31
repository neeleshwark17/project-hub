import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, useUpdateProject, useDeleteProject } from '@/hooks/use-graphql';
import { Header } from '@/components/layout/Header';
import { AnimatedProjectCard } from '@/components/project/AnimatedProjectCard';
import { AnimatedList, AnimatedItem } from '@/components/ui/animated-container';
import { CreateProjectModal } from '@/components/project/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FallbackUI, ProjectCardSkeleton } from '@/components/ui/fallback-ui';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Edit,
  Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProjectStatus } from '@/types';

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  dueDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProject, setEditingProject] = useState<any>(null);

  const { organization } = useAuth();
  const navigate = useNavigate();
  
  const { data: projectsData, loading, error } = useProjects();
  const { updateProject, loading: updating } = useUpdateProject();
  const { deleteProject, loading: deleting } = useDeleteProject();

  const projects = projectsData?.projects || [];

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
      dueDate: "",
    },
  });

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Count projects by status
  const projectCounts = {
    all: projects.length,
    planning: projects.filter(p => p.status === 'planning').length,
    active: projects.filter(p => p.status === 'active').length,
    'on_hold': projects.filter(p => p.status === 'on_hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length,
  };

  const handleProjectView = (project: { id: string }) => {
    navigate(`/projects/${project.id}`);
  };

  const handleProjectEdit = (project: any) => {
    setEditingProject(project);
    form.reset({
      name: project.name,
      description: project.description || "",
      status: project.status,
      dueDate: project.dueDate || "",
    });
  };

  const handleProjectDelete = async (project: any) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        const result = await deleteProject({
          variables: { id: project.id },
        });
        
        if (result.data?.deleteProject?.errors?.length > 0) {
          alert(`Failed to delete project: ${result.data.deleteProject.errors[0]}`);
        } else if (result.data?.deleteProject?.success) {
          console.log('Project deleted successfully');
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };



  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!editingProject) return;
    
    try {
      const result = await updateProject({
        variables: {
          id: editingProject.id,
          name: data.name,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate || null,
        },
      });
      
      if (result.data?.updateProject?.errors?.length > 0) {
        alert(`Failed to update project: ${result.data.updateProject.errors[0]}`);
      } else if (result.data?.updateProject?.success) {
        console.log('Project updated successfully');
        setEditingProject(null);
        form.reset();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert('Failed to update project. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading projects. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gradient-surface">
        <Header 
          title="Projects"
          subtitle={`${filteredProjects.length} of ${projects.length} projects`}
        />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: ProjectStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({projectCounts.all})</SelectItem>
                <SelectItem value="planning">Planning ({projectCounts.planning})</SelectItem>
                <SelectItem value="active">Active ({projectCounts.active})</SelectItem>
                <SelectItem value="on_hold">On Hold ({projectCounts['on_hold']})</SelectItem>
                <SelectItem value="completed">Completed ({projectCounts.completed})</SelectItem>
                <SelectItem value="cancelled">Cancelled ({projectCounts.cancelled})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Create Project */}
            <CreateProjectModal
              trigger={
                <Button variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              }
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(projectCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={statusFilter === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(status as ProjectStatus | 'all')}
              className="flex items-center space-x-2"
            >
              <span className="capitalize">{status === 'on_hold' ? 'On Hold' : status}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Projects Grid/List */}
        {error ? (
          <FallbackUI 
            type="error" 
            title="Failed to load projects"
            message="Unable to load projects. Please try again."
            onRetry={() => window.location.reload()}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No projects found' 
                  : 'No projects yet'
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <CreateProjectModal
                  trigger={
                    <Button variant="gradient">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Project
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        ) : (
          <AnimatedList className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProjects.map((project, index) => (
              <AnimatedItem key={project.id}>
                <AnimatedProjectCard
                  project={project}
                  onView={handleProjectView}
                  onEdit={() => handleProjectEdit(project)}
                  onDelete={() => handleProjectDelete(project)}
                  index={index}
                />
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </main>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProject)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updating} className="w-full">
                {updating ? "Updating..." : "Update Project"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
    </ErrorBoundary>
  );
}