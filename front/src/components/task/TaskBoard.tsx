import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskView: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask?: (status: TaskStatus) => void;
  loading?: boolean;
}

const statusConfig = {
  todo: { label: 'To Do', className: 'status-todo', icon: '📋' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress', icon: '🔄' },
  completed: { label: 'Completed', className: 'status-completed', icon: '✅' },
  blocked: { label: 'Blocked', className: 'status-blocked', icon: '🚫' },
};

interface SortableTaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

function SortableTaskCard({ task, onView, onStatusChange }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onView={onView}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}

export function TaskBoard({ tasks, onTaskView, onStatusChange, onAddTask, loading = false }: TaskBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed'),
    blocked: tasks.filter(task => task.status === 'blocked'),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeTask = tasks.find(task => task.id === active.id);
      const overStatus = over?.id as TaskStatus;
      
      if (activeTask && overStatus && Object.keys(statusConfig).includes(overStatus)) {
        onStatusChange(activeTask.id, overStatus as TaskStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card key={status} className="card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center">
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {tasksByStatus[status as TaskStatus]?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <SortableContext
                items={tasksByStatus[status as TaskStatus]?.map(task => task.id) || []}
                strategy={verticalListSortingStrategy}
              >
                {tasksByStatus[status as TaskStatus]?.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onView={onTaskView}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </SortableContext>
              
              {tasksByStatus[status as TaskStatus]?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No tasks
                </div>
              )}
              
              {onAddTask && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onAddTask(status as TaskStatus)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}
