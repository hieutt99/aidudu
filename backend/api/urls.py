from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *


from rest_framework.routers import DefaultRouter
# app_name = 'api'
router = DefaultRouter()
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'cards', CardViewSet, basename='card')

urlpatterns = [
    path('auth/login', TokenObtainPairView.as_view(), name='login'), # ok 
    path('auth/refresh', TokenRefreshView.as_view(), name='refresh'), # ok
    path('auth/register', UserRegister.as_view(), name='register'), # ok 
    path('auth/forgot-password', ForgotPasswordView.as_view(),name='forgot-password'),
    path('me', CurrentUserAPIView.as_view(),name='me'),# ok
]

urlpatterns += router.urls

