import { gql } from '@apollo/client';

// Organization Queries
export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      createdAt
      updatedAt
    }
  }
`;

// Project Queries
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      dueDate
      organization {
        id
        slug
      }
      createdAt
      updatedAt
      taskCount
      completedTaskCount
      completionRate
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      organization {
        id
        slug
        name
      }
      createdAt
      updatedAt
      taskCount
      completedTaskCount
      completionRate
    }
  }
`;

// Task Queries
export const GET_TASKS = gql`
  query GetTasks($projectId: ID) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      project {
        id
        name
        status
      }
      assigneeEmail
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      project {
        id
        name
        status
        organization {
          slug
        }
      }
      assigneeEmail
      dueDate
      createdAt
      updatedAt
    }
  }
`;

// Comment Queries
export const GET_COMMENTS = gql`
  query GetComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      task {
        id
      }
      authorEmail
      timestamp
    }
  }
`;

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      avatar
    }
  }
`;

// Project Statistics
export const GET_PROJECT_STATS = gql`
  query GetProjectStats {
    projectStats {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overallCompletionRate
    }
  }
`;

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $status: String, $dueDate: Date, $organizationSlug: String!) {
    createProject(
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
      organizationSlug: $organizationSlug
    ) {
      project {
        id
        name
        description
        status
        dueDate
        organization {
          id
          slug
          name
        }
        createdAt
      }
      success
      errors
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String, $status: String, $dueDate: Date) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        updatedAt
      }
      success
      errors
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      message
      errors
    }
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $title: String!, $description: String, $status: String, $assigneeEmail: String, $dueDate: Date) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        createdAt
      }
      success
      errors
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String, $assigneeEmail: String, $dueDate: Date) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        updatedAt
      }
      success
      errors
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
      errors
    }
  }
`;

// Comment Mutations
export const CREATE_COMMENT = gql`
  mutation CreateComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        task {
          id
        }
        authorEmail
        timestamp
      }
      success
      errors
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      comment {
        id
        content
        task {
          id
        }
        authorEmail
        timestamp
      }
      success
      errors
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      success
      message
      errors
    }
  }
`;
