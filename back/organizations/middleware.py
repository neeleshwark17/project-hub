"""
Middleware for handling multi-tenant organization context.
"""
from django.http import JsonResponse
from .models import Organization
import logging

logger = logging.getLogger(__name__)


class OrganizationMiddleware:
    """
    Middleware to set organization context based on request headers or URL parameters.
    
    Supports two methods:
    1. X-Organization-Slug header
    2. organization_slug query parameter
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get organization slug from header or query parameter
        org_slug = (
            request.headers.get('X-Organization-Slug') or
            request.GET.get('organization_slug')
        )

        if org_slug:
            try:
                organization = Organization.objects.get(slug=org_slug)
                request.organization = organization
                logger.info(f"Organization context set: {organization.name}")
            except Organization.DoesNotExist:
                logger.warning(f"Organization not found: {org_slug}")
                if request.path.startswith('/graphql/'):
                    return JsonResponse({
                        'errors': [{'message': f'Organization "{org_slug}" not found'}]
                    }, status=404)
                request.organization = None
        else:
            # For GraphQL endpoints, organization context is often required
            if request.path.startswith('/graphql/'):
                logger.warning("No organization slug provided for GraphQL request")
            request.organization = None

        response = self.get_response(request)
        return response