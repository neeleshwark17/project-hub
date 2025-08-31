import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Project, Task, Comment, User } from '@/types';
import {
  GET_ORGANIZATION,
  GET_PROJECTS,
  GET_PROJECT,
  GET_TASKS,
  GET_TASK,
  GET_COMMENTS,
  GET_USERS,
  GET_PROJECT_STATS,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from '@/lib/graphql/operations';

// Type definitions for GraphQL responses
interface ProjectsResponse {
  projects: Project[];
}

interface ProjectResponse {
  project: Project;
}

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

interface CommentsResponse {
  taskComments: Comment[];
}

interface UsersResponse {
  users: User[];
}

interface ProjectStatsResponse {
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    overallCompletionRate: number;
  };
}



// Organization Hooks
export const useOrganization = (slug: string) => {
  return useQuery(GET_ORGANIZATION, {
    variables: { slug },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  });
};

// Project Hooks
export const useProjects = () => {
  return useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-and-network',
  });
};

export const useProject = (id: string) => {
  return useQuery(GET_PROJECT, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
};

export const useCreateProject = () => {
  const [mutate, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    onCompleted: (data: { createProject: { errors?: string[]; success?: boolean } }) => {
      if (data.createProject?.errors?.length > 0) {
        const errorMessage = data.createProject.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.createProject?.success) {
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { createProject: mutate, loading };
};

export const useUpdateProject = () => {
  const [mutate, { loading }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    onCompleted: (data: { updateProject: { errors?: string[]; success?: boolean } }) => {
      if (data.updateProject?.errors?.length > 0) {
        const errorMessage = data.updateProject.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.updateProject?.success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { updateProject: mutate, loading };
};

export const useDeleteProject = () => {
  const [mutate, { loading }] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    onCompleted: (data: { deleteProject: { errors?: string[]; success?: boolean } }) => {
      if (data.deleteProject?.errors?.length > 0) {
        const errorMessage = data.deleteProject.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.deleteProject?.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { deleteProject: mutate, loading };
};

// Task Hooks
export const useTasks = (projectId?: string) => {
  return useQuery(GET_TASKS, {
    variables: { projectId },
    fetchPolicy: 'cache-and-network',
  });
};

export const useTask = (id: string) => {
  return useQuery(GET_TASK, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
};

export const useCreateTask = () => {
  const [mutate, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: (data: { createTask: { errors?: string[]; success?: boolean } }) => {
      if (data.createTask?.errors?.length > 0) {
        const errorMessage = data.createTask.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.createTask?.success) {
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { createTask: mutate, loading };
};

export const useUpdateTask = () => {
  const [mutate, { loading }] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: (data: { updateTask: { errors?: string[]; success?: boolean } }) => {
      if (data.updateTask?.errors?.length > 0) {
        const errorMessage = data.updateTask.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.updateTask?.success) {
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { updateTask: mutate, loading };
};

export const useDeleteTask = () => {
  const [mutate, { loading }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { deleteTask: mutate, loading };
};

// Comment Hooks
export const useComments = (taskId: string) => {
  return useQuery(GET_COMMENTS, {
    variables: { taskId },
    skip: !taskId,
    fetchPolicy: 'cache-and-network',
  });
};

export const useCreateComment = () => {
  const [mutate, { loading }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS }],
    onCompleted: (data: { addTaskComment: { errors?: string[]; success?: boolean } }) => {
      if (data.addTaskComment?.errors?.length > 0) {
        const errorMessage = data.addTaskComment.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.addTaskComment?.success) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { createComment: mutate, loading };
};

export const useUpdateComment = () => {
  const [mutate, { loading }] = useMutation(UPDATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS }],
    onCompleted: (data: { updateComment: { errors?: string[]; success?: boolean } }) => {
      if (data.updateComment?.errors?.length > 0) {
        const errorMessage = data.updateComment.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.updateComment?.success) {
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { updateComment: mutate, loading };
};

export const useDeleteComment = () => {
  const [mutate, { loading }] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS }],
    onCompleted: (data: { deleteComment: { errors?: string[]; success?: boolean } }) => {
      if (data.deleteComment?.errors?.length > 0) {
        const errorMessage = data.deleteComment.errors[0];
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.deleteComment?.success) {
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { deleteComment: mutate, loading };
};

// User Hooks
export const useUsers = () => {
  return useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  });
};

// Project Statistics Hooks
export const useProjectStats = () => {
  return useQuery(GET_PROJECT_STATS, {
    fetchPolicy: 'cache-and-network',
  });
};
