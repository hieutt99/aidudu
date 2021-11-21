from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, override_settings
from requests.auth import HTTPBasicAuth
from django.conf import settings
from django.contrib.auth import get_user_model

from utilities.crypto import *
from api.models import (
	CustomUser, 
	Workspace, 
	WorkspaceMembership, 
	Board, 
	BoardMembership, 
	List, 
	Label, 
	Card, 
	CardMembership, 
	CardLabelRelationship, 
	Checklist,
	ChecklistItem,
	Comment, 
	Attachment
)

from api.serializers import (
	UserSerializer,
	UserRegisterSerializer,
	BoardSerializer,
	WorkspaceSerializer,
	CardSerializer,
	CardCreateSerializer
)

def hook_init_APITestCase(this):
	this.username = "john"
	this.email = "john@snow.com"
	this.password = "you_know_nothing"        

	this.me = CustomUser.objects.create_user(
		username=this.username,
		email=this.email,
		password=this.password 
	)

	data = base64.b64encode(f'{this.username}:{this.password}'.encode()).decode()
	this.client.credentials(HTTP_AUTHORIZATION=f"Basic {data}")
	this.client.HTTP_USER_AGENT='Mozilla/5.0'
	
	