from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from api.serializers import *
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.viewsets import ModelViewSet
from api.models import *

class CurrentUserAPIView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class WorkspaceViewSet(ModelViewSet):
    model = Workspace