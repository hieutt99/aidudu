from django.urls import path
from .views import *


from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

urlpatterns = [
    path('me', CurrentUserAPIView.as_view()),
]

urlpatterns += router.urls

