// TypeScript interfaces for GraphQL responses
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  dueDate?: string;
  organization: { id: string; slug: string };
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  completedTaskCount?: number;
  tasks?: any[];
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface StatsResponse {
  projectStats: ProjectStats;
}
