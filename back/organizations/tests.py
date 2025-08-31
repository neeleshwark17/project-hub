"""
Unit tests for organizations app GraphQL queries and mutations.
"""
import pytest
from django.test import TestCase, RequestFactory
from graphene.test import Client
from backend.schema import schema
from .models import Organization, Project, Task, TaskComment
from .middleware import OrganizationMiddleware
from datetime import date


class GraphQLTestCase(TestCase):
    """Base test case for GraphQL tests."""
    
    def setUp(self):
        self.client = Client(schema)
        self.factory = RequestFactory()
        
        # Create test organization
        self.organization = Organization.objects.create(
            name="Test Organization",
            slug="test-org",
            contact_email="test@example.com"
        )
        
        # Create test project
        self.project = Project.objects.create(
            organization=self.organization,
            name="Test Project",
            description="Test project description",
            status="active",
            due_date=date(2024, 12, 31)
        )
        
        # Create test task
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="Test task description",
            status="todo",
            assignee_email="assignee@example.com",
            due_date=date(2024, 6, 30)
        )

    def get_context_with_organization(self):
        """Create a request context with organization."""
        request = self.factory.get('/')
        request.organization = self.organization
        return request


class TestQueries(GraphQLTestCase):
    """Test GraphQL queries."""

    def test_organization_query(self):
        """Test organization query."""
        query = """
        query {
            organization(slug: "test-org") {
                name
                slug
                contactEmail
            }
        }
        """
        context = self.get_context_with_organization()
        result = self.client.execute(query, context=context)
        
        self.assertIsNone(result.get('errors'))
        data = result['data']['organization']
        self.assertEqual(data['name'], "Test Organization")
        self.assertEqual(data['slug'], "test-org")

    def test_projects_query(self):
        """Test projects listing query."""
        query = """
        query {
            projects {
                id
                name
                status
                taskCount
                completionRate
            }
        }
        """
        context = self.get_context_with_organization()
        result = self.client.execute(query, context=context)
        
        self.assertIsNone(result.get('errors'))
        projects = result['data']['projects']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]['name'], "Test Project")

    def test_tasks_query(self):
        """Test tasks listing query."""
        query = """
        query {
            tasks {
                id
                title
                status
                assigneeEmail
            }
        }
        """
        context = self.get_context_with_organization()
        result = self.client.execute(query, context=context)
        
        self.assertIsNone(result.get('errors'))
        tasks = result['data']['tasks']
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['title'], "Test Task")

    def test_project_stats_query(self):
        """Test project statistics query."""
        query = """
        query {
            projectStats {
                totalProjects
                activeProjects
                totalTasks
                overallCompletionRate
            }
        }
        """
        context = self.get_context_with_organization()
        result = self.client.execute(query, context=context)
        
        self.assertIsNone(result.get('errors'))
        stats = result['data']['projectStats']
        self.assertEqual(stats['totalProjects'], 1)
        self.assertEqual(stats['activeProjects'], 1)
        self.assertEqual(stats['totalTasks'], 1)


class TestMutations(GraphQLTestCase):
    """Test GraphQL mutations."""

    def test_create_project_mutation(self):
        """Test project creation mutation."""
        mutation = """
        mutation {
            createProject(
                name: "New Project"
                description: "New project description"
                status: "planning"
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
        """
        context = self.get_context_with_organization()
        result = self.client.execute(mutation, context=context)
        
        self.assertIsNone(result.get('errors'))
        data = result['data']['createProject']
        self.assertTrue(data['success'])
        self.assertEqual(data['project']['name'], "New Project")

    def test_update_task_mutation(self):
        """Test task update mutation."""
        mutation = f"""
        mutation {{
            updateTask(
                id: {self.task.id}
                status: "completed"
            ) {{
                success
                errors
                task {{
                    id
                    status
                }}
            }}
        }}
        """
        context = self.get_context_with_organization()
        result = self.client.execute(mutation, context=context)
        
        self.assertIsNone(result.get('errors'))
        data = result['data']['updateTask']
        self.assertTrue(data['success'])
        self.assertEqual(data['task']['status'], "completed")

    def test_add_comment_mutation(self):
        """Test adding comment to task."""
        mutation = f"""
        mutation {{
            addTaskComment(
                taskId: {self.task.id}
                content: "This is a test comment"
                authorEmail: "commenter@example.com"
            ) {{
                success
                errors
                comment {{
                    id
                    content
                    authorEmail
                }}
            }}
        }}
        """
        context = self.get_context_with_organization()
        result = self.client.execute(mutation, context=context)
        
        self.assertIsNone(result.get('errors'))
        data = result['data']['addTaskComment']
        self.assertTrue(data['success'])
        self.assertEqual(data['comment']['content'], "This is a test comment")


class TestMultiTenancy(GraphQLTestCase):
    """Test multi-tenancy isolation."""

    def setUp(self):
        super().setUp()
        # Create second organization
        self.other_organization = Organization.objects.create(
            name="Other Organization",
            slug="other-org",
            contact_email="other@example.com"
        )

    def test_organization_isolation(self):
        """Test that queries only return data for the current organization."""
        query = """
        query {
            projects {
                id
                name
            }
        }
        """
        # Test with first organization
        context = self.get_context_with_organization()
        result = self.client.execute(query, context=context)
        projects = result['data']['projects']
        self.assertEqual(len(projects), 1)
        
        # Test with second organization (should return empty)
        request = self.factory.get('/')
        request.organization = self.other_organization
        result = self.client.execute(query, context=request)
        projects = result['data']['projects']
        self.assertEqual(len(projects), 0)

    def test_unauthorized_access_without_organization(self):
        """Test that queries without organization context return empty results."""
        query = """
        query {
            projects {
                id
                name
            }
        }
        """
        request = self.factory.get('/')
        request.organization = None
        result = self.client.execute(query, context=request)
        projects = result['data']['projects']
        self.assertEqual(len(projects), 0)


class TestMiddleware(TestCase):
    """Test organization middleware."""

    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = OrganizationMiddleware(lambda req: None)
        self.organization = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@example.com"
        )

    def test_organization_header(self):
        """Test organization context from header."""
        request = self.factory.get('/', HTTP_X_ORGANIZATION_SLUG='test-org')
        self.middleware(request)
        self.assertEqual(request.organization, self.organization)

    def test_organization_query_parameter(self):
        """Test organization context from query parameter."""
        request = self.factory.get('/?organization_slug=test-org')
        self.middleware(request)
        self.assertEqual(request.organization, self.organization)

    def test_no_organization_context(self):
        """Test request without organization context."""
        request = self.factory.get('/')
        self.middleware(request)
        self.assertIsNone(request.organization)