# 🚀 Project Management Application

A full-stack project management application built with Django (GraphQL API) and React (TypeScript).

## 📋 Features

- **Project Management**: Create, edit, delete, and track projects
- **Task Management**: Organize tasks with priorities and statuses
- **Comments System**: Add, edit, and delete comments on tasks
- **Multi-tenant**: Organization-based data isolation
- **Real-time Updates**: GraphQL API with Apollo Client
- **Modern UI**: Built with Shadcn UI and Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Graphene-Django** - GraphQL API
- **PostgreSQL** - Database
- **Django CORS Headers** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Apollo Client** - GraphQL client
- **React Router** - Navigation
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd assignment
   ```

2. **Set up Python environment:**
   ```bash
   cd back
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database and secret key
   ```

4. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb project_management
   
   # Run migrations
   python manage.py migrate
   ```

5. **Import existing data (optional):**
   ```bash
   # Import the provided data backup
   python migrate_data.py
   ```

6. **Start the backend server:**
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd front
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

## 📊 Database Import Guide

### Importing Data to Local PostgreSQL

The application includes a data backup with sample projects, tasks, and comments. To import this data:

1. **Ensure your database is set up:**
   ```bash
   cd back
   python manage.py migrate
   ```

2. **Import the data backup:**
   ```bash
   python migrate_data.py
   ```

3. **Verify the import:**
   ```bash
   python manage.py shell
   ```
   ```python
   from organizations.models import Organization, Project, Task, TaskComment
   print(f"Organizations: {Organization.objects.count()}")
   print(f"Projects: {Project.objects.count()}")
   print(f"Tasks: {Task.objects.count()}")
   print(f"Comments: {TaskComment.objects.count()}")
   ```

### Data Backup Contents

The `back/data_backup.json` file contains:
- **1 Organization**: "Demo Organization" (demo-org)
- **Multiple Projects**: Sample projects with different statuses
- **Tasks**: Various tasks with priorities and assignees
- **Comments**: Sample comments on tasks
- **Users**: Demo user accounts

### Manual Data Import

If you prefer to import manually:

```bash
cd back
python manage.py loaddata data_backup.json
```

## 🔧 Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/project_management
CORS_ALLOWED_ORIGINS=["http://localhost:8080", "http://127.0.0.1:8080"]
ALLOWED_HOSTS=["localhost", "127.0.0.1"]
```

### Frontend
```env
VITE_API_URL=http://localhost:8000/graphql/
```

## 📁 Project Structure

```
assignment/
├── back/                    # Django backend
│   ├── backend/            # Django project settings
│   ├── organizations/      # Main app with models
│   ├── data_backup.json    # Database backup
│   ├── migrate_data.py     # Data import script
│   └── requirements.txt    # Python dependencies
├── front/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and config
│   └── package.json       # Node dependencies
└── deploy.sh              # Deployment script
```

## 🚀 Deployment

### Railway (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Add PostgreSQL database
   - Set environment variables
   - Deploy!

3. **Migrate data:**
   ```bash
   railway connect
   python migrate_data.py
   ```

### Other Platforms

- **Render**: Web service + PostgreSQL + Static site
- **Heroku**: App + PostgreSQL addon
- **DigitalOcean**: App Platform

## 🔍 API Documentation

### GraphQL Endpoint
```
POST /graphql/
```

### Key Queries
- `projects`: Get all projects
- `tasks`: Get all tasks
- `stats`: Get dashboard statistics

### Key Mutations
- `createProject`: Create new project
- `updateProject`: Update project
- `deleteProject`: Delete project
- `createComment`: Add comment to task
- `updateComment`: Edit comment
- `deleteComment`: Delete comment

## 🧪 Testing

### Backend Tests
```bash
cd back
python manage.py test
```

### Frontend Tests
```bash
cd front
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📊 Sample Data

After importing the data backup, you'll have:

- **Organization**: Demo Organization
- **Projects**: 5 sample projects with different statuses
- **Tasks**: 15+ tasks across various projects
- **Comments**: Sample comments on tasks
- **Users**: Demo user accounts for testing

Login with any email to access the demo organization.
