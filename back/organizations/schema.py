"""
GraphQL schema for organizations, projects, tasks, and comments.
"""
import graphene
from graphene_django import DjangoObjectType
from graphene import relay
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    """GraphQL type for Organization model."""
    
    class Meta:
        model = Organization
        fields = '__all__'


class ProjectType(DjangoObjectType):
    """GraphQL type for Project model."""
    task_count = graphene.Int()
    completed_task_count = graphene.Int()
    completion_rate = graphene.Float()
    
    class Meta:
        model = Project
        fields = '__all__'

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_task_count(self, info):
        return self.completed_task_count

    def resolve_completion_rate(self, info):
        return self.completion_rate


class TaskType(DjangoObjectType):
    """GraphQL type for Task model."""
    
    class Meta:
        model = Task
        fields = '__all__'


class TaskCommentType(DjangoObjectType):
    """GraphQL type for TaskComment model."""
    
    class Meta:
        model = TaskComment
        fields = '__all__'


class ProjectStatsType(graphene.ObjectType):
    """GraphQL type for project statistics."""
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    overall_completion_rate = graphene.Float()


class Query(graphene.ObjectType):
    """Root query for all organization-related queries."""
    
    # Organization queries
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    # Project queries
    projects = graphene.List(ProjectType)
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    project_stats = graphene.Field(ProjectStatsType)
    
    # Task queries
    tasks = graphene.List(TaskType, project_id=graphene.ID())
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    
    # Comment queries
    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))

    def resolve_organization(self, info, slug):
        """Get organization by slug."""
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            return None

    def resolve_projects(self, info):
        """List all projects for the current organization."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []
        return Project.objects.filter(organization=organization)

    def resolve_project(self, info, id):
        """Get a specific project by ID within the organization."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return None
        try:
            return Project.objects.get(id=id, organization=organization)
        except Project.DoesNotExist:
            return None

    def resolve_project_stats(self, info):
        """Get project statistics for the organization."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return ProjectStatsType(
                total_projects=0,
                active_projects=0,
                completed_projects=0,
                total_tasks=0,
                completed_tasks=0,
                overall_completion_rate=0
            )
        
        projects = Project.objects.filter(organization=organization)
        total_projects = projects.count()
        active_projects = projects.filter(status='active').count()
        completed_projects = projects.filter(status='completed').count()
        
        tasks = Task.objects.filter(project__organization=organization)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='completed').count()
        
        overall_completion_rate = 0
        if total_tasks > 0:
            overall_completion_rate = (completed_tasks / total_tasks) * 100
        
        return ProjectStatsType(
            total_projects=total_projects,
            active_projects=active_projects,
            completed_projects=completed_projects,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            overall_completion_rate=overall_completion_rate
        )

    def resolve_tasks(self, info, project_id=None):
        """List tasks, optionally filtered by project."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []
        
        tasks = Task.objects.filter(project__organization=organization)
        if project_id:
            tasks = tasks.filter(project_id=project_id)
        return tasks

    def resolve_task(self, info, id):
        """Get a specific task by ID within the organization."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return None
        try:
            return Task.objects.get(id=id, project__organization=organization)
        except Task.DoesNotExist:
            return None

    def resolve_task_comments(self, info, task_id):
        """Get comments for a specific task."""
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []
        
        try:
            task = Task.objects.get(id=task_id, project__organization=organization)
            return task.comments.all()
        except Task.DoesNotExist:
            return []


class CreateProject(graphene.Mutation):
    """Mutation to create a new project."""
    
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
        organizationSlug = graphene.String(required=True)

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, description='', status='planning', due_date=None, organizationSlug=None):
        try:
            # Get organization by slug
            organization = Organization.objects.get(slug=organizationSlug)
        except Organization.DoesNotExist:
            return CreateProject(
                success=False, 
                errors=[f'Organization with slug "{organizationSlug}" not found']
            )

        try:
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(project=project, success=True, errors=[])
        except ValidationError as e:
            return CreateProject(
                success=False, 
                errors=[str(e)]
            )


class UpdateProject(graphene.Mutation):
    """Mutation to update an existing project."""
    
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return UpdateProject(
                success=False, 
                errors=['Organization context required']
            )

        try:
            project = Project.objects.get(id=id, organization=organization)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(project, field, value)
            
            project.full_clean()
            project.save()
            
            return UpdateProject(project=project, success=True, errors=[])
        except Project.DoesNotExist:
            return UpdateProject(
                success=False, 
                errors=['Project not found']
            )
        except ValidationError as e:
            return UpdateProject(
                success=False, 
                errors=[str(e)]
            )


class DeleteProject(graphene.Mutation):
    """Mutation to delete a project."""
    
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return DeleteProject(
                success=False, 
                errors=['Organization context required']
            )

        try:
            project = Project.objects.get(id=id, organization=organization)
            project_name = project.name
            project.delete()
            
            return DeleteProject(
                success=True, 
                message=f'Project "{project_name}" deleted successfully',
                errors=[]
            )
        except Project.DoesNotExist:
            return DeleteProject(
                success=False, 
                errors=['Project not found']
            )
        except Exception as e:
            return DeleteProject(
                success=False, 
                errors=[f'Error deleting project: {str(e)}']
            )


class DeleteTask(graphene.Mutation):
    """Mutation to delete a task."""
    
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return DeleteTask(
                success=False, 
                errors=['Organization context required']
            )

        try:
            task = Task.objects.get(id=id, project__organization=organization)
            task_title = task.title
            task.delete()
            
            return DeleteTask(
                success=True, 
                message=f'Task "{task_title}" deleted successfully',
                errors=[]
            )
        except Task.DoesNotExist:
            return DeleteTask(
                success=False, 
                errors=['Task not found']
            )
        except Exception as e:
            return DeleteTask(
                success=False, 
                errors=[f'Error deleting task: {str(e)}']
            )


class CreateTask(graphene.Mutation):
    """Mutation to create a new task."""
    
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.Date()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, project_id, title, description='', 
               status='todo', assignee_email=None, due_date=None):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return CreateTask(
                success=False, 
                errors=['Organization context required']
            )

        try:
            project = Project.objects.get(id=project_id, organization=organization)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(task=task, success=True, errors=[])
        except Project.DoesNotExist:
            return CreateTask(
                success=False, 
                errors=['Project not found']
            )
        except ValidationError as e:
            return CreateTask(
                success=False, 
                errors=[str(e)]
            )


class UpdateTask(graphene.Mutation):
    """Mutation to update an existing task."""
    
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.Date()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return UpdateTask(
                success=False, 
                errors=['Organization context required']
            )

        try:
            task = Task.objects.get(id=id, project__organization=organization)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(task, field, value)
            
            task.full_clean()
            task.save()
            
            return UpdateTask(task=task, success=True, errors=[])
        except Task.DoesNotExist:
            return UpdateTask(
                success=False, 
                errors=['Task not found']
            )
        except ValidationError as e:
            return UpdateTask(
                success=False, 
                errors=[str(e)]
            )


class AddTaskComment(graphene.Mutation):
    """Mutation to add a comment to a task."""
    
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, content, author_email):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return AddTaskComment(
                success=False, 
                errors=['Organization context required']
            )

        try:
            task = Task.objects.get(id=task_id, project__organization=organization)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return AddTaskComment(comment=comment, success=True, errors=[])
        except Task.DoesNotExist:
            return AddTaskComment(
                success=False, 
                errors=['Task not found']
            )
        except ValidationError as e:
            return AddTaskComment(
                success=False, 
                errors=[str(e)]
            )


class UpdateComment(graphene.Mutation):
    """Mutation to update an existing comment."""
    
    class Arguments:
        id = graphene.ID(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, content):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return UpdateComment(
                success=False, 
                errors=['Organization context required']
            )

        try:
            comment = TaskComment.objects.get(id=id, task__project__organization=organization)
            comment.content = content
            comment.full_clean()
            comment.save()
            
            return UpdateComment(comment=comment, success=True, errors=[])
        except TaskComment.DoesNotExist:
            return UpdateComment(
                success=False, 
                errors=['Comment not found']
            )
        except ValidationError as e:
            return UpdateComment(
                success=False, 
                errors=[str(e)]
            )


class DeleteComment(graphene.Mutation):
    """Mutation to delete a comment."""
    
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return DeleteComment(
                success=False, 
                errors=['Organization context required']
            )

        try:
            comment = TaskComment.objects.get(id=id, task__project__organization=organization)
            comment_content = comment.content[:50] + "..." if len(comment.content) > 50 else comment.content
            comment.delete()
            
            return DeleteComment(
                success=True, 
                message=f'Comment "{comment_content}" deleted successfully',
                errors=[]
            )
        except TaskComment.DoesNotExist:
            return DeleteComment(
                success=False, 
                errors=['Comment not found']
            )
        except Exception as e:
            return DeleteComment(
                success=False, 
                errors=[f'Error deleting comment: {str(e)}']
            )


class Mutation(graphene.ObjectType):
    """Root mutation for all organization-related mutations."""
    
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    add_task_comment = AddTaskComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()