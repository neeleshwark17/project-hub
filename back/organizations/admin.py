"""
Admin interface configuration for organizations app.
"""
from django.contrib import admin
from .models import Organization, Project, Task, TaskComment


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """Admin interface for Organization model."""
    list_display = ['name', 'slug', 'contact_email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug', 'contact_email']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Admin interface for Project model."""
    list_display = ['name', 'organization', 'status', 'due_date', 'created_at']
    list_filter = ['status', 'organization', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'task_count', 'completion_rate']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin interface for Task model."""
    list_display = ['title', 'project', 'status', 'assignee_email', 'due_date', 'created_at']
    list_filter = ['status', 'project__organization', 'created_at']
    search_fields = ['title', 'description', 'assignee_email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    """Admin interface for TaskComment model."""
    list_display = ['task', 'author_email', 'timestamp']
    list_filter = ['timestamp', 'task__project__organization']
    search_fields = ['content', 'author_email']
    readonly_fields = ['timestamp']