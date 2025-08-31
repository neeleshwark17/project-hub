"""
Pytest configuration and fixtures.
"""
import pytest
from django.test import RequestFactory
from organizations.factories import OrganizationFactory, ProjectFactory, TaskFactory


@pytest.fixture
def organization():
    """Create a test organization."""
    return OrganizationFactory()


@pytest.fixture
def project(organization):
    """Create a test project."""
    return ProjectFactory(organization=organization)


@pytest.fixture
def task(project):
    """Create a test task."""
    return TaskFactory(project=project)


@pytest.fixture
def request_factory():
    """Provide Django's RequestFactory."""
    return RequestFactory()


@pytest.fixture
def authenticated_request(request_factory, organization):
    """Create a request with organization context."""
    request = request_factory.get('/')
    request.organization = organization
    return request