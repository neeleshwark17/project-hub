# Project Management System

A modern, multi-tenant project management tool built with React, TypeScript, and GraphQL.

## Features

- 🔐 **Authentication & Multi-tenancy** - Secure login with organization-based data isolation
- 📊 **Dashboard** - Real-time project statistics and overview
- 🚀 **Project Management** - Create, edit, and manage projects with full CRUD operations
- ✅ **Task Management** - Track tasks with status updates and assignments
- 💬 **Comment System** - Collaborate with team members through task comments
- 🎨 **Modern UI** - Beautiful, responsive design built with TailwindCSS and shadcn/ui
- 🔄 **Real-time Updates** - Optimistic updates and proper cache management with Apollo Client

## Tech Stack

### Frontend
- **React 18+** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Apollo Client** - GraphQL client with caching and optimistic updates
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend Integration
- **GraphQL API** - Modern API with queries and mutations
- **Multi-tenancy** - Organization-based data isolation
- **Real-time Updates** - Optimistic updates and cache management

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API running on `http://localhost:8000`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql/
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### Authentication
- Use any email and password to log in (demo mode)
- The system will create a mock user and organization for demonstration

### Dashboard
- View project statistics and recent activities
- Navigate to projects and tasks
- Quick access to create new projects

### Projects
- View all projects in grid or list mode
- Filter by status and search by name/description
- Create, edit, and delete projects
- View project details and tasks

### Tasks
- View task details and comments
- Add comments to tasks
- Update task status
- Navigate between related projects

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── project/        # Project-related components
│   ├── task/           # Task-related components
│   ├── comment/        # Comment components
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom hooks
│   └── use-graphql.ts  # GraphQL operation hooks
├── lib/                # Utility libraries
│   ├── apollo.ts       # Apollo Client configuration
│   ├── graphql/        # GraphQL operations
│   └── config.ts       # Configuration
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## GraphQL Operations

The application includes comprehensive GraphQL operations:

### Queries
- `GetProjects` - Fetch projects for an organization
- `GetProject` - Fetch single project details
- `GetTasks` - Fetch tasks with filtering
- `GetTask` - Fetch single task details
- `GetComments` - Fetch task comments
- `GetUsers` - Fetch organization users
- `GetProjectStats` - Fetch project statistics

### Mutations
- `CreateProject` - Create new projects
- `UpdateProject` - Update existing projects
- `DeleteProject` - Delete projects
- `CreateTask` - Create new tasks
- `UpdateTask` - Update existing tasks
- `DeleteTask` - Delete tasks
- `CreateComment` - Add comments to tasks
- `UpdateComment` - Edit comments
- `DeleteComment` - Delete comments

## API Endpoints

The application integrates with a Django + GraphQL backend:

- **Root URL** (`/`) - API health check
- **Admin Interface** (`/admin/`) - Django admin panel
- **GraphQL Endpoint** (`/graphql/`) - Main API interface

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **TailwindCSS** - Utility-first CSS approach

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow shadcn/ui design patterns
- Ensure responsive design
- Include loading states and error handling

## Testing

The application includes:
- **Error Boundaries** - Graceful error handling
- **Loading States** - Skeleton loaders and spinners
- **Form Validation** - Client-side validation with Zod
- **Toast Notifications** - User feedback for actions

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure these environment variables are set in production:
- `VITE_GRAPHQL_ENDPOINT` - Production GraphQL API endpoint
- `VITE_API_BASE_URL` - Production API base URL

### Static Hosting

The built application can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review the GraphQL schema
- Test with the GraphiQL interface at `/graphql/`
- Check browser console for errors

## Future Improvements

- [ ] Real-time updates with GraphQL subscriptions
- [ ] Advanced filtering and search
- [ ] Drag and drop task management
- [ ] File attachments
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] Time tracking
- [ ] Project templates