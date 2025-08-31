import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, useProjectStats, useTasks } from '@/hooks/use-graphql';
import { Header } from '@/components/layout/Header';
import { AnimatedProjectCard } from '@/components/project/AnimatedProjectCard';
import { AnimatedTaskCard } from '@/components/task/AnimatedTaskCard';
import { AnimatedList, AnimatedItem } from '@/components/ui/animated-container';
import { CreateProjectModal } from '@/components/project/CreateProjectModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { FallbackUI, StatsCardSkeleton, ProjectCardSkeleton, TaskCardSkeleton } from '@/components/ui/fallback-ui';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Project, Task } from '@/types';
import { formatPercentage, roundToTwoDecimals } from '@/lib/utils';
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  AlertCircle,
  Wifi
} from 'lucide-react';

interface ProjectsData {
  projects: Project[];
}

interface TasksData {
  tasks: Task[];
}

interface StatsData {
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    overallCompletionRate: number;
  };
}

export default function Dashboard() {
  const { user, organization } = useAuth();
  const navigate = useNavigate();
  
  const { data: projectsData, loading: projectsLoading, error: projectsError } = useProjects();
  const { data: statsData, loading: statsLoading, error: statsError } = useProjectStats();
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks();

  const projects = (projectsData as ProjectsData)?.projects || [];
  const stats = (statsData as StatsData)?.projectStats;
  const tasks = (tasksData as TasksData)?.tasks || [];
  
  // Get recent projects and tasks
  const recentProjects = projects.slice(0, 3);
  const myTasks = tasks.slice(0, 4);

  const handleProjectView = (project: { id: string }) => {
    navigate(`/projects/${project.id}`);
  };

  const handleTaskView = (task: { id: string }) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleCreateProject = () => {
    // This will be handled by the CreateProjectModal
  };

  // Debug logging
  console.log('Dashboard Debug:', {
    organization,
    projectsData,
    statsData,
    tasksData,
    projectsError,
    statsError,
    tasksError
  });

  // Handle errors gracefully
  if (projectsError) {
    console.error('Projects error:', projectsError);
  }
  if (statsError) {
    console.error('Stats error:', statsError);
  }
  if (tasksError) {
    console.error('Tasks error:', tasksError);
  }

  // Check if we have any errors
  const hasErrors = projectsError || statsError || tasksError;
  const isLoading = projectsLoading || statsLoading || tasksLoading;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gradient-surface">
        <Header 
          title={`Welcome back to ${organization?.name || 'Project Manager'}`}
          subtitle="Here's what's happening with your projects today"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Statistics Cards */}
          {hasErrors ? (
            <FallbackUI 
              type="error" 
              title="Failed to load statistics"
              message="Unable to load project statistics. Please try again."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.activeProjects || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {projectsLoading ? <Skeleton className="h-3 w-20" /> : `${stats?.totalProjects || 0} total projects`}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalTasks || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statsLoading ? <Skeleton className="h-3 w-20" /> : `${stats?.completedTasks || 0} completed`}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : formatPercentage(stats?.overallCompletionRate || 0)}
                  </div>
                  <Progress 
                    value={roundToTwoDecimals(stats?.overallCompletionRate || 0)} 
                    className="mt-2 h-2" 
                  />
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.completedProjects || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successfully delivered
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Projects */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Projects</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {projectsError ? (
                <FallbackUI 
                  type="error" 
                  title="Failed to load projects"
                  message="Unable to load recent projects. Please try again."
                  onRetry={() => window.location.reload()}
                />
              ) : projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <Card className="card-enhanced">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Get started by creating your first project
                    </p>
                    <CreateProjectModal
                      trigger={
                        <Button variant="gradient">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Project
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              ) : (
                <AnimatedList className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentProjects.map((project, index) => (
                    <AnimatedItem key={project.id}>
                      <AnimatedProjectCard
                        project={project}
                        onView={handleProjectView}
                        index={index}
                      />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Tasks</h2>
                <Badge variant="secondary">{myTasks.length}</Badge>
              </div>
              
              {tasksError ? (
                <FallbackUI 
                  type="error" 
                  title="Failed to load tasks"
                  message="Unable to load recent tasks. Please try again."
                  onRetry={() => window.location.reload()}
                />
              ) : tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <TaskCardSkeleton key={i} />
                  ))}
                </div>
              ) : myTasks.length === 0 ? (
                <Card className="card-enhanced">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <CheckSquare className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground text-center">
                      No tasks available
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatedList className="space-y-3">
                  {myTasks.map((task, index) => (
                    <AnimatedItem key={task.id}>
                      <AnimatedTaskCard
                        task={task}
                        onView={handleTaskView}
                        index={index}
                      />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              )}
            </div>
          </div>


        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}