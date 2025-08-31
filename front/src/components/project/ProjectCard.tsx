import { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { cn, roundToTwoDecimals } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

const statusConfig = {
  planning: { label: 'Planning', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  ACTIVE: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'on-hold': { label: 'On Hold', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ON_HOLD: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  ARCHIVED: { label: 'Archived', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  PLANNING: { label: 'Planning', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const progress = project.tasksCount ? (project.completedTasksCount! / project.tasksCount) * 100 : 0;
  const roundedProgress = roundToTwoDecimals(progress);
  const statusInfo = statusConfig[project.status] || statusConfig.planning; // Fallback to planning if status not found

  return (
    <Card className="card-enhanced group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          <Badge variant="secondary" className={cn("text-xs", statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(project)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(project)} className="text-destructive">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{roundedProgress}%</span>
          </div>
          <Progress value={roundedProgress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>{project.completedTasksCount || 0}/{project.tasksCount || 0} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => onView?.(project)}
        >
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}