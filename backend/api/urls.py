from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import *


from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'cards', CardViewSet, basename='card')

urlpatterns = [
    path('auth/login', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh', TokenRefreshView.as_view(), name='refresh'),
    path('auth/register', UserRegister.as_view(), name='register'),
    path('auth/forgot-password', ForgotPasswordView.as_view()),
    path('me', CurrentUserAPIView.as_view()),
]

urlpatterns += router.urls

