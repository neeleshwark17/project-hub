import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProject, useTasks, useCreateTask, useUpdateTask, useUpdateProject } from '@/hooks/use-graphql';
import { Header } from '@/components/layout/Header';
import { TaskBoard } from '@/components/task/TaskBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  ArrowLeft,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeEmail: z.string().email().optional().or(z.literal('')),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  dueDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const statusConfig = {
  todo: { label: 'To Do', className: 'status-todo', icon: Clock },
  'in_progress': { label: 'In Progress', className: 'status-in-progress', icon: AlertCircle },
  completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 },
  blocked: { label: 'Blocked', className: 'status-blocked', icon: AlertCircle },
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  const { data: projectData, loading: projectLoading, error: projectError } = useProject(projectId || '');
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks(projectId);
  const { createTask, loading: creatingTask } = useCreateTask();
  const { updateTask, loading: updatingTask } = useUpdateTask();
  const { updateProject, loading: updatingProject } = useUpdateProject();

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assigneeEmail: "",
      dueDate: "",
    },
  });

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
      dueDate: "",
    },
  });

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in_progress': tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed'),
    blocked: tasks.filter(task => task.status === 'blocked'),
  };

  const handleCreateTask = async (data: TaskFormData) => {
    if (!projectId) return;
    
    try {
      await createTask({
        variables: {
          projectId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          assigneeEmail: data.assigneeEmail || undefined,
          dueDate: data.dueDate || undefined,
        },
      });
      setIsCreateTaskOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditProject = (project: any) => {
    setIsEditProjectOpen(true);
    projectForm.reset({
      name: project.name,
      description: project.description || "",
      status: project.status,
      dueDate: project.dueDate || "",
    });
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!projectId) return;
    
    try {
      const result = await updateProject({
        variables: {
          id: projectId,
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
        setIsEditProjectOpen(false);
        projectForm.reset();
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert('Failed to update project. Please try again.');
    }
  };

  const handleTaskView = (task: { id: string }) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask({
        variables: {
          id: taskId,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (projectError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading project. Please try again later.
        </div>
      </div>
    );
  }

  if (projectLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  const completionRate = project.completionRate || 0;
  const totalTasks = project.taskCount || 0;
  const completedTasks = project.completedTaskCount || 0;

  return (
    <div className="flex flex-col h-screen bg-gradient-surface">
      <Header 
        title={project.name}
        subtitle={project.description || 'Project Details'}
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          {/* Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={`status-${project.status}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                        {project.dueDate && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{project.name}</CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-4">
                      {project.description}
                    </p>
                  )}
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{completedTasks} of {totalTasks} tasks completed</span>
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Tasks</span>
                    <Badge variant="secondary">{totalTasks}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <Badge variant="outline" className="text-green-600">{completedTasks}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <Badge variant="outline" className="text-blue-600">
                      {tasksByStatus['in_progress'].length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blocked</span>
                    <Badge variant="outline" className="text-red-600">
                      {tasksByStatus.blocked.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateTask)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Task Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter task title" {...field} />
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
                                  <Textarea placeholder="Enter task description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="assigneeEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assignee Email (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="assignee@example.com" {...field} />
                                </FormControl>
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
                          <Button type="submit" disabled={creatingTask} className="w-full">
                            {creatingTask ? "Creating..." : "Create Task"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Task Board */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Task Board</h2>
              <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {tasksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : (
              <TaskBoard
                tasks={tasks}
                onTaskView={handleTaskView}
                onStatusChange={handleStatusChange}
                onAddTask={() => setIsCreateTaskOpen(true)}
                loading={tasksLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(handleUpdateProject)} className="space-y-4">
              <FormField
                control={projectForm.control}
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
                control={projectForm.control}
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
                control={projectForm.control}
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
                control={projectForm.control}
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
              <Button type="submit" disabled={updatingProject} className="w-full">
                {updatingProject ? "Updating..." : "Update Project"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
