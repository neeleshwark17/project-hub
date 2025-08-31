import { Task } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Flag,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (task: Task, status: Task['status']) => void;
  onView?: (task: Task) => void;
}

const statusConfig = {
  todo: { label: 'To Do', className: 'status-todo' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
  blocked: { label: 'Blocked', className: 'status-blocked' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'priority-low', icon: Flag },
  medium: { label: 'Medium', className: 'priority-medium', icon: Flag },
  high: { label: 'High', className: 'priority-high', icon: Flag },
  urgent: { label: 'Urgent', className: 'priority-urgent', icon: Flag },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onView }: TaskCardProps) {
  const statusInfo = statusConfig[task.status] || statusConfig.todo;
  const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium;
  const PriorityIcon = priorityInfo.icon;
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <Card className="card-enhanced group cursor-pointer" onClick={() => onView?.(task)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-2">
          <div className="flex-1 space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={cn("text-xs", statusInfo.className)}>
                {statusInfo.label}
              </Badge>
              <div className={cn("flex items-center space-x-1", priorityInfo.className)}>
                <PriorityIcon className="h-3 w-3" />
                <span className="text-xs font-medium">{priorityInfo.label}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(task); }}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}>
                Edit Task
              </DropdownMenuItem>
              {task.status !== 'completed' && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.(task, 'completed'); }}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(task); }} className="text-destructive">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Assignee */}
        {task.assigneeEmail && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assigneeEmail.split('@')[0].split('.').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assigneeEmail}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            {dueDate && (
              <div className={cn(
                "flex items-center space-x-1",
                isOverdue && "text-destructive"
              )}>
                <Calendar className="h-3 w-3" />
                <span>{dueDate.toLocaleDateString()}</span>
                {isOverdue && <Clock className="h-3 w-3" />}
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
}