from django.urls import path
from .views import *

urlpatterns = [
    path('me', CurrentUserAPIView.as_view()),
]
