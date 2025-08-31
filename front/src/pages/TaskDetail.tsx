import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTask, useComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/use-graphql';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { CommentList } from '@/components/comment/CommentList';
import { FallbackUI } from '@/components/ui/fallback-ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft,
  Calendar,
  Flag,
  User,
  Edit,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: taskData, loading: taskLoading, error: taskError } = useTask(taskId || '');
  const { data: commentsData, loading: commentsLoading, error: commentsError } = useComments(taskId || '');
  
  const { createComment, loading: creatingComment } = useCreateComment();
  const { updateComment, loading: updatingComment } = useUpdateComment();
  const { deleteComment, loading: deletingComment } = useDeleteComment();

  const task = taskData?.task;
  const comments = commentsData?.comments || [];

  const statusConfig = {
    todo: { label: 'To Do', className: 'status-todo', icon: Clock },
    'in_progress': { label: 'In Progress', className: 'status-in-progress', icon: AlertCircle },
    completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 },
    blocked: { label: 'Blocked', className: 'status-blocked', icon: AlertCircle },
  };

  const priorityConfig = {
    low: { label: 'Low', className: 'priority-low' },
    medium: { label: 'Medium', className: 'priority-medium' },
    high: { label: 'High', className: 'priority-high' },
    urgent: { label: 'Urgent', className: 'priority-urgent' },
  };

  const statusInfo = statusConfig[task?.status || 'todo'] || statusConfig.todo;
  const priorityInfo = priorityConfig[task?.priority || 'medium'] || priorityConfig.medium;
  const StatusIcon = statusInfo.icon;
  
  const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const dueDate = task?.dueDate ? new Date(task.dueDate) : null;

  const handleAddComment = async (content: string, authorEmail: string) => {
    if (!task) return;
    
    try {
      await createComment({
        variables: {
          taskId: task.id,
          content,
          authorEmail,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await updateComment({
        variables: {
          id: commentId,
          content,
        },
      });
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({
        variables: {
          id: commentId,
        },
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    
    try {
      // You would implement task status update here
      console.log('Update task status:', task.id, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (taskError) {
    return (
      <div className="p-6">
        <FallbackUI 
          type="error" 
          title="Failed to load task"
          message="Unable to load task details. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (taskLoading) {
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

  if (!task) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Task not found</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-gradient-surface">
        <Header 
          title={task.title}
          subtitle={task.project?.name ? `${task.project.name} • Task Details` : 'Task Details'}
        />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Header */}
              <Card className="card-enhanced">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={statusInfo.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                        <div className={`flex items-center space-x-1 ${priorityInfo.className}`}>
                          <Flag className="h-3 w-3" />
                          <span className="text-xs font-medium">{priorityInfo.label}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{task.title}</CardTitle>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                {task.description && (
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {task.description}
                    </p>
                  </CardContent>
                )}
              </Card>

                          {/* Comments */}
            <CommentList 
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              loading={commentsLoading}
              currentUserEmail={user?.email}
            />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Details */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Task Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Assignee */}
                  <div className="space-y-2">
                    <div className="flex items-center text-xs font-medium text-muted-foreground">
                      <User className="mr-2 h-3 w-3" />
                      Assignee
                    </div>
                    {task.assignee ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{task.assignee.name}</div>
                          <div className="text-xs text-muted-foreground">{task.assigneeEmail}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Unassigned</div>
                    )}
                  </div>

                  <Separator />

                  {/* Due Date */}
                  <div className="space-y-2">
                    <div className="flex items-center text-xs font-medium text-muted-foreground">
                      <Calendar className="mr-2 h-3 w-3" />
                      Due Date
                    </div>
                    {dueDate ? (
                      <div className={`text-sm ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                        {dueDate.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {isOverdue && (
                          <div className="flex items-center mt-1 text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            Overdue
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No due date set</div>
                    )}
                  </div>

                  <Separator />

                  {/* Project */}
                  {task.project && (
                    <>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Project</div>
                        <div className="text-sm font-medium">{task.project.name}</div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Timestamps */}
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <div className="font-medium">Created</div>
                      <div>{new Date(task.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div>{new Date(task.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </Button>
                  {task.status !== 'completed' && (
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleStatusChange('completed')}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Reassign
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
}