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
        fields = ('id', 'username', 'email',
                  'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True},
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

class ListSerializer(serializers.ModelSerializer):

    class Meta:
        model = List
        fields = '__all__'


class ListCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = List
        fields = '__all__'


class WorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Workspace
        fields = '__all__'
class WorkspaceMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceMembership
        fields = ['user_id', 'role']

class WorkspaceBoardSerializer(serializers.ModelSerializer):

    # admin = serializers.SerializerMethodField('get_admin_of_workspace')
    workspaces = WorkspaceMembershipSerializer(many=True);
    class Meta:
        model = Workspace
        fields = ['id', 'name', 'workspaces', 'visibility', 'logo', 'boards']
    
    def get_admin_of_workspace(self, workspace_src):
        admim_membership = WorkspaceMembership.objects.filter(workspace=workspace_src, role=WorkspaceMembership.ROLE.ADMIN).first()
        return admim_membership.user.id


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class CardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = '__all__'


class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'

class BoardDetailViewCardSerializer(serializers.ModelSerializer):
    comments = serializers.IntegerField(source='comments.count', read_only=True)
    attachments = serializers.IntegerField(source='attachments.count', read_only=True)
    class Meta:
        model = Card
        fields = ['id', 'title', 'due', 'position', 'comments', 'attachments', 'labels']

class BoardDetailViewListSerializer(serializers.ModelSerializer):
        cards = BoardDetailViewCardSerializer(many=True)
        class Meta:
            model = List
            fields = ['id', 'name', 'position', 'archive', 'cards']
                                                                              #todo: checklist stat
class BoardDetailViewSerializer(serializers.ModelSerializer):

    lists = BoardDetailViewListSerializer(many=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'background', 'workspace', 'members', 'lists', 'labels']