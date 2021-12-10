from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from .views import *

router = DefaultRouter()
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'cards', CardViewSet, basename='card')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'checklists', ChecklistViewSet, basename='checklist')
router.register(r'checklist_items', ChecklistItemViewSet, basename='checklist_item')
router.register(r'lists', ListViewSet, basename='list')
router.register(r'labels', LabelViewSet, basename='label')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/login', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('auth/register', UserRegister.as_view(), name='register'),
    path('auth/forgot-password', ForgotPasswordView.as_view(),name='forgot-password'),
    path('me', CurrentUserAPIView.as_view(),name='me'),
]

urlpatterns += router.urls

