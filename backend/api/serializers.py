from rest_framework import fields, serializers
from django.contrib.auth import get_user, get_user_model
from api.models import *
from django.db.models import Count


class UserSerializer(serializers.ModelSerializer):
    """Serializer for listing and retrieving user(s)"""

    class Meta:
        model = get_user_model()
        exclude = ('password', 'groups', 'user_permissions', 'is_superuser', 'is_staff', 'is_active')


class GeneralUserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar')

    def get_avatar(self, instance):
        request = self.context.get('request')
        if not instance.avatar:
            return None
        
        url = instance.avatar.url
        return request.build_absolute_uri(url) if request else url


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

class UserDisplaySerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField('get_full_name_of_user')

    class Meta:
        model = CustomUser
        fields = ['id', 'fullname', 'avatar', 'lastname', 'firstname']

    def get_full_name_of_user(self, user):
        return user.get_full_name()


class WorkspaceMembershipSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_user_id_of_workspacemembership')
    fullname = serializers.SerializerMethodField('get_user_fullname_of_workspacemembership')
    firstname = serializers.SerializerMethodField()
    lastname = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField('get_user_avatar_of_workspacemembership')
    
    class Meta:
        model = WorkspaceMembership
        fields = ['id', 'fullname', 'avatar', 'role', "firstname", "lastname"]

    def get_firstname(self, instance):
        return instance.user.first_name

    def get_lastname(self, instance):
        return instance.user.last_name

    def get_user_id_of_workspacemembership(self, workspace_src):
        return workspace_src.user.id

    def get_user_fullname_of_workspacemembership(self, workspace_src):
        return workspace_src.user.get_full_name()
    
    def get_user_avatar_of_workspacemembership(self, workspace_src):
        request = self.context.get('request')
        if not workspace_src.user.avatar:
            return None
        
        url = workspace_src.user.avatar.url
        return request.build_absolute_uri(url) if request else url


class WorkspaceBoardSerializer(serializers.ModelSerializer):
    # admin = serializers.SerializerMethodField('get_admin_of_workspace')
    members = WorkspaceMembershipSerializer(source='workspaces', many=True)

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'members', 'visibility', 'logo', 'boards']
    
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

class CommentUserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'avatar')

    def get_avatar(self, instance):
        request = self.context.get('request')
        if not instance.avatar:
            return None
        
        url = instance.avatar.url
        return request.build_absolute_uri(url) if request else url

class CommentCardSerializer(serializers.ModelSerializer):
    # user = CommentUserSerializer()

    user = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
    
    def get_user(self, instance):
        user = CommentUserSerializer(instance.user, context=self.context)
        return user.data


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = '__all__'

class ChecklistItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'

class ChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'
        read_only_fields = ['id', 'checklist']

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'


class CardMembershipSerializer(serializers.ModelSerializer):    
    id = serializers.SerializerMethodField('get_user_id_of_cardmembership')
    fullname = serializers.SerializerMethodField('get_user_fullname_of_cardmembership')
    avatar = serializers.SerializerMethodField("get_avatar_of_card_member")
    firstname = serializers.SerializerMethodField()
    lastname = serializers.SerializerMethodField()
    
    class Meta:
        model = CardMembership
        fields = ['id', 'fullname', 'avatar', 'firstname', 'lastname']

    def get_user_id_of_cardmembership(self, card_src):
        return card_src.user.id

    def get_user_fullname_of_cardmembership(self, card_src):
        return card_src.user.get_full_name()
    
    def get_avatar_of_card_member(self, instance):
        request = self.context.get("request")
        if not instance.user.avatar:
            return None 
        url = instance.user.avatar.url 
        return request.build_absolute_uri(url) if request else url 

    def get_firstname(self, instance):
        return instance.user.first_name

    def get_lastname(self, instance):
        return instance.user.last_name


class ChecklistStatSerializer(serializers.ModelSerializer):
    stats = serializers.SerializerMethodField('get_stat')

    class Meta:
        model = Checklist
        fields = ['id', 'stats']

    def get_stat(self, checklist_src):
        stats = checklist_src.items.order_by('id').values('checked').annotate(count=Count('id'))
        return stats

class ChecklistDetailSerializer(serializers.ModelSerializer):
    items = ChecklistItemSerializer("items", many=True)
    class Meta:
        model = Checklist
        fields = ['id', 'title', 'position', 'items']

class LabelDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Label
        fields = ['id', 'name', 'color']

class BoardDetailViewCardSerializer(serializers.ModelSerializer):
    comments = serializers.IntegerField(source='comments.count', read_only=True)
    attachments = serializers.IntegerField(source='attachments.count', read_only=True)
    members = serializers.SerializerMethodField()
    checklists = ChecklistStatSerializer('checklists', many=True)
    labels = LabelDetailSerializer('labels', many=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'due', 'position', 'comments', 'attachments', 'labels', 'members', 'checklists', 'archived']

    def get_members(self, instance):
        members = CardMembership.objects.filter(card_id=instance.id)
        return CardMembershipSerializer(members, many=True, context=self.context).data

class BoardDetailViewListSerializer(serializers.ModelSerializer):
        # cards = BoardDetailViewCardSerializer(many=True)
        cards = serializers.SerializerMethodField("get_cards")
        archived_cards = serializers.SerializerMethodField("get_archived_cards")
        class Meta:
            model = List
            fields = ['id', 'name', 'position', 'archived', 'cards', 'archived_cards']
        
        def get_cards(self, instance):
            cards = instance.cards.filter(archived=False)
            serializer = BoardDetailViewCardSerializer(cards, many=True, context=self.context)
            return serializer.data

        def get_archived_cards(self, instance):
            cards = instance.cards.filter(archived=True)
            serializer = BoardDetailViewCardSerializer(cards, many=True, context=self.context)
            return serializer.data
            
class BoardMemberSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar')
    
    def get_avatar(self, instance):
        request = self.context.get('request')
        if not instance.avatar:
            return None
        
        url = instance.avatar.url
        return request.build_absolute_uri(url) if request else url

class BoardMembershipSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    firstname = serializers.SerializerMethodField()
    lastname = serializers.SerializerMethodField()

    class Meta:
        model = BoardMembership
        fields = ["id", "username", "avatar", "firstname", "lastname"]

    def get_id(self, instance):
        return instance.user.id 
    def get_username(self, instance):
        return instance.user.username
    def get_firstname(self, instance):
        return instance.user.first_name
    def get_lastname(self, instance):
        return instance.user.last_name
    def get_avatar(self, instance):
        request = self.context.get("request")
        if not instance.user.avatar:
            return None 
        url = instance.user.avatar.url 
        return request.build_absolute_uri(url) if request else url 

class BoardDetailViewSerializer(serializers.ModelSerializer):
    lists = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    labels = serializers.SerializerMethodField()
    starred = serializers.SerializerMethodField()
    # admins = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ['id', 'name', 'visibility', 'background', 'workspace', 'members', 'lists', 'labels', 'starred']
    
    def get_lists(self, instance):
        return BoardDetailViewListSerializer(instance.lists, many=True, context=self.context).data

    def get_members(self, instance):
        bms = BoardMembership.objects.filter(board=instance)

        data = []
        for bm in bms:
            user_data = GeneralUserSerializer(bm.user, context=self.context).data
            user_data.update({"role": bm.role})
            data.append(user_data)
        
        return data
    
    def get_labels(self, instance):
        labels = LabelDetailSerializer(instance.labels, many=True)
        return labels.data
    
    def get_starred(self, instance):
        if 'request' not in self.context:
            return None
        
        user = self.context['request'].user

        bms = BoardMembership.objects.filter(user=user, board=instance)

        if not bms.exists():
            return None
        return bms.first().starred
    
    # def get_admins(self, instance):
    #     if 'request' not in self.context:
    #         return None
        
    #     bms = BoardMembership.objects.filter(board=instance, role=BoardMembership.ROLE.ADMIN)

    #     data = []

    #     for bm in bms:
    #         user = bm.user

    #         user_data = GeneralUserSerializer(bm.user, context=self.context).data
    #         user_data.update({"role": bm.role})

    #         data.append(user_data)
        
    #     return data
        

class ListDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'name']

class CardDetailViewSerializer(serializers.ModelSerializer):
    checklists = ChecklistDetailSerializer('checklists', many=True)
    labels = LabelSerializer('labels', many=True)
    comments = serializers.SerializerMethodField()
    list = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    class Meta:
        model = Card 
        fields = ['id', 'title', 'description', 'start', 'due',
                'position', 'list', 'labels', 'comments', 'checklists', 'members']
    
    def get_comments(self, instance):
        comments = CommentCardSerializer(instance.comments, many=True, context=self.context)

        return comments.data

    def get_list(self, instance):
        list = ListDetailSerializer(instance.list)
        return list.data

    def get_members(self, instance):
        card_membership = CardMembership.objects.filter(
            card_id=instance.id
        )
        return CardMembershipSerializer(card_membership, many=True, context=self.context).data