from rest_framework import fields, serializers
from django.contrib.auth import get_user_model
from api.models import *

class UserSerializer(serializers.ModelSerializer):
    """Serializer for listing and retrieving user(s)"""
    
    class Meta:
        model = get_user_model()
        exclude = ('password', )



class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    class Meta:
        model = get_user_model()
        fields = ('id','username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password':{'write_only': True},
        }
    
    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class BoardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Board
        fields = '__all__'


class WorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'
