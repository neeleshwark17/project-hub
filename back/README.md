# Django GraphQL Backend

Django backend API with GraphQL support, multi-tenancy, and PostgreSQL integration for managing organizations, projects, tasks, and comments.

## Features

- **GraphQL API** powered by Graphene-Django
- **Multi-tenant architecture** with organization-based isolation
- **PostgreSQL** database integration
- **Comprehensive CRUD operations** for projects, tasks, and comments
- **Project analytics and statistics**
- **Unit tests** with pytest and factory-boy
- **Production-ready configuration**

## Technology Stack

- **Django 4.2.7** - Web framework
- **Graphene-Django 3.1.0** - GraphQL integration
- **PostgreSQL** - Primary database
- **pytest** - Testing framework
- **factory-boy** - Test data generation

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Setup Instructions

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE project_management;
CREATE USER pm_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE project_management TO pm_user;
\q
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://pm_user:your_password@localhost:5432/project_management
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install requirements
python -m pip install -r requirements.txt
```

### 4. Database Migration

```bash
# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 5. Start Development Server

```bash
python manage.py runserver
```

The GraphQL playground will be available at: http://localhost:8000/graphql/

## API Usage

### Multi-Tenancy

All API requests must include organization context via:

1. **HTTP Header**: `X-Organization-Slug: your-org-slug`
2. **Query Parameter**: `?organization_slug=your-org-slug`

### Example Queries

#### List Projects
```graphql
query {
  projects {
    id
    name
    status
    taskCount
    completionRate
    dueDate
  }
}
```

#### Get Project Statistics
```graphql
query {
  projectStats {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
    overallCompletionRate
  }
}
```

#### List Tasks for a Project
```graphql
query {
  tasks(projectId: "1") {
    id
    title
    status
    assigneeEmail
    dueDate
  }
}
```

#### Get Task Comments
```graphql
query {
  taskComments(taskId: "1") {
    id
    content
    authorEmail
    timestamp
  }
}
```

### Example Mutations

#### Create Project
```graphql
mutation {
  createProject(
    name: "New Project"
    description: "Project description"
    status: "planning"
    dueDate: "2024-12-31"
  ) {
    success
    errors
    project {
      id
      name
      status
    }
  }
}
```

#### Update Task
```graphql
mutation {
  updateTask(
    id: "1"
    status: "completed"
  ) {
    success
    errors
    task {
      id
      status
    }
  }
}
```

#### Add Comment to Task
```graphql
mutation {
  addTaskComment(
    taskId: "1"
    content: "This is a comment"
    authorEmail: "user@example.com"
  ) {
    success
    errors
    comment {
      id
      content
    }
  }
}
```

## Models Overview

### Organization
- `name` - Organization name
- `slug` - URL-friendly identifier
- `contact_email` - Primary contact email

### Project
- `organization` - Foreign key to Organization
- `name` - Project name
- `description` - Project description
- `status` - One of: planning, active, completed, on_hold, cancelled
- `due_date` - Project deadline

### Task
- `project` - Foreign key to Project
- `title` - Task title
- `description` - Task description
- `status` - One of: todo, in_progress, completed, blocked
- `assignee_email` - Email of assigned person
- `due_date` - Task deadline

### TaskComment
- `task` - Foreign key to Task
- `content` - Comment text
- `author_email` - Comment author email
- `timestamp` - When comment was created

## Testing

Run the test suite:

```bash
# Run all tests
python manage.py test

# Run with pytest (recommended)
pytest

# Run with coverage
coverage run -m pytest
coverage report
```

## Admin Interface

Access the Django admin at: http://localhost:8000/admin/

The admin interface provides full CRUD operations for all models with proper filtering and search capabilities.

## Security Features

- **Multi-tenant isolation** - Data is automatically filtered by organization
- **Input validation** - All GraphQL inputs are validated
- **CORS configuration** - Configurable cross-origin resource sharing
- **SQL injection protection** - Django ORM provides built-in protection

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in environment
2. Configure proper `SECRET_KEY`
3. Set up production database
4. Configure `ALLOWED_HOSTS`
5. Set up static file serving
6. Configure logging and monitoring

## Contributing

1. Follow Django coding standards
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting changes