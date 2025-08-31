import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks, useProjects } from '@/hooks/use-graphql';
import { Header } from '@/components/layout/Header';
import { AnimatedTaskCard } from '@/components/task/AnimatedTaskCard';
import { AnimatedList, AnimatedItem } from '@/components/ui/animated-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter,
  Grid3X3,
  List,
  Calendar,
  Flag,
  User,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types';

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks();
  const { data: projectsData, loading: projectsLoading } = useProjects();

  const tasks = tasksData?.tasks || [];
  const projects = projectsData?.projects || [];

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Count tasks by status
  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  // Count tasks by priority
  const priorityCounts = {
    all: tasks.length,
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
  };

  const handleTaskView = (task: { id: string }) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleProjectView = (project: { id: string }) => {
    navigate(`/projects/${project.id}`);
  };

  const statusConfig = {
    todo: { label: 'To Do', className: 'status-todo', icon: Clock },
    'in-progress': { label: 'In Progress', className: 'status-in-progress', icon: AlertCircle },
    completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 },
    blocked: { label: 'Blocked', className: 'status-blocked', icon: AlertCircle },
  };

  const priorityConfig = {
    low: { label: 'Low', className: 'priority-low', icon: Flag },
    medium: { label: 'Medium', className: 'priority-medium', icon: Flag },
    high: { label: 'High', className: 'priority-high', icon: Flag },
    urgent: { label: 'Urgent', className: 'priority-urgent', icon: Flag },
  };

  if (tasksError) {
    return (
      <div className="p-6">
        <div className="text-red-500">
          Error loading tasks. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-surface">
      <Header 
        title="Tasks"
        subtitle={`${filteredTasks.length} of ${tasks.length} tasks`}
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({taskCounts.all})</SelectItem>
                <SelectItem value="todo">To Do ({taskCounts.todo})</SelectItem>
                <SelectItem value="in-progress">In Progress ({taskCounts['in-progress']})</SelectItem>
                <SelectItem value="completed">Completed ({taskCounts.completed})</SelectItem>
                <SelectItem value="blocked">Blocked ({taskCounts.blocked})</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={(value: TaskPriority | 'all') => setPriorityFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <Flag className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities ({priorityCounts.all})</SelectItem>
                <SelectItem value="low">Low ({priorityCounts.low})</SelectItem>
                <SelectItem value="medium">Medium ({priorityCounts.medium})</SelectItem>
                <SelectItem value="high">High ({priorityCounts.high})</SelectItem>
                <SelectItem value="urgent">Urgent ({priorityCounts.urgent})</SelectItem>
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
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
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(taskCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={statusFilter === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(status as TaskStatus | 'all')}
              className="flex items-center space-x-2"
            >
              {status !== 'all' && (
                <>
                  {(() => {
                    const config = statusConfig[status as TaskStatus];
                    const Icon = config.icon;
                    return <Icon className="h-3 w-3" />;
                  })()}
                </>
              )}
              <span className="capitalize">{status === 'in-progress' ? 'In Progress' : status}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Priority Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(priorityCounts).map(([priority, count]) => (
            <Button
              key={priority}
              variant={priorityFilter === priority ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPriorityFilter(priority as TaskPriority | 'all')}
              className="flex items-center space-x-2"
            >
              {priority !== 'all' && (
                <>
                  {(() => {
                    const config = priorityConfig[priority as TaskPriority];
                    const Icon = config.icon;
                    return <Icon className="h-3 w-3" />;
                  })()}
                </>
              )}
              <span className="capitalize">{priority}</span>
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tasks Grid/List */}
        {tasksLoading ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className={viewMode === 'grid' ? "h-48 w-full" : "h-20 w-full"} />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
                  ? 'No tasks found' 
                  : 'No tasks yet'
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first task in a project'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && projectFilter === 'all' && (
                <Button variant="gradient" onClick={() => navigate('/projects')}>
                  View Projects
                </Button>
              )}
            </div>
          </div>
        ) : (
          <AnimatedList className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredTasks.map((task, index) => (
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
      </main>
    </div>
  );
}
