"""
Factory Boy factories for testing.
"""
import factory
from django.utils.text import slugify
from .models import Organization, Project, Task, TaskComment


class OrganizationFactory(factory.django.DjangoModelFactory):
    """Factory for creating Organization instances."""
    
    class Meta:
        model = Organization
    
    name = factory.Sequence(lambda n: f"Organization {n}")
    slug = factory.LazyAttribute(lambda obj: slugify(obj.name))
    contact_email = factory.Faker('email')


class ProjectFactory(factory.django.DjangoModelFactory):
    """Factory for creating Project instances."""
    
    class Meta:
        model = Project
    
    organization = factory.SubFactory(OrganizationFactory)
    name = factory.Sequence(lambda n: f"Project {n}")
    description = factory.Faker('text', max_nb_chars=200)
    status = factory.Faker('random_element', elements=[choice[0] for choice in Project.STATUS_CHOICES])
    due_date = factory.Faker('future_date', end_date='+365d')


class TaskFactory(factory.django.DjangoModelFactory):
    """Factory for creating Task instances."""
    
    class Meta:
        model = Task
    
    project = factory.SubFactory(ProjectFactory)
    title = factory.Sequence(lambda n: f"Task {n}")
    description = factory.Faker('text', max_nb_chars=200)
    status = factory.Faker('random_element', elements=[choice[0] for choice in Task.STATUS_CHOICES])
    assignee_email = factory.Faker('email')
    due_date = factory.Faker('future_date', end_date='+180d')


class TaskCommentFactory(factory.django.DjangoModelFactory):
    """Factory for creating TaskComment instances."""
    
    class Meta:
        model = TaskComment
    
    task = factory.SubFactory(TaskFactory)
    content = factory.Faker('text', max_nb_chars=500)
    author_email = factory.Faker('email')