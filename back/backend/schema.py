"""
Main GraphQL schema that combines all app schemas.
"""
import graphene
from organizations.schema import Query as OrganizationsQuery
from organizations.schema import Mutation as OrganizationsMutation


class Query(OrganizationsQuery, graphene.ObjectType):
    """Root query combining all app queries."""
    pass


class Mutation(OrganizationsMutation, graphene.ObjectType):
    """Root mutation combining all app mutations."""
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)