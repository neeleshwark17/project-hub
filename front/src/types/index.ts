// Core types for the project management application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  tasksCount?: number;
  completedTasksCount?: number;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeEmail?: string;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  commentsCount?: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorEmail: string;
  timestamp: string;
}

// Form types
export interface CreateProjectForm {
  name: string;
  description?: string;
  status: ProjectStatus;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeEmail?: string;
  dueDate?: string;
}

export interface CreateCommentForm {
  content: string;
  authorEmail: string;
}

// UI State types
export interface FilterState {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
}

export interface SortState {
  field: 'createdAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}