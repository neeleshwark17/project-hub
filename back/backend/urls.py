"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from graphene_django.views import GraphQLView
from django.http import HttpResponse

def redirect_to_graphql(request):
    return HttpResponse('hello api is working!')

urlpatterns = [
    path('', redirect_to_graphql, name='root'),
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]