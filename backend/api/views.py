from django.contrib.auth import get_user_model
from django.shortcuts import get_list_or_404, get_object_or_404
from django.db import transaction
import requests
from django.urls import reverse
import json
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.serializers import ListSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from utilities.request import parse_bool_or_400, parse_int_or_400, parse_string_array_or_400

from api.models import *
from api.serializers import *
from rest_framework.decorators import action


class CurrentUserAPIView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserRegister(GenericAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args,  **kwargs):
        """Register new user"""

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        res_data = json.loads(requests.post(request.build_absolute_uri(
            reverse('login')), json=request.data).content)

        return Response({
            'access': res_data['access'],
            'refresh': res_data['refresh'],
            'user': UserSerializer(user, context=self.get_serializer_context()).data
        }, status=status.HTTP_201_CREATED)


class ForgotPasswordView(APIView):
    def post(self, request, format=None):
        """Help user choose a new password"""

        # TODO: implement this feature
        return Response(status=status.HTTP_200_OK)


class BoardViewSet(ModelViewSet):
    model = Board

    def get_serializer_class(self):
        return BoardSerializer

    def get_queryset(self):
        workspace_id = parse_int_or_400(self.request.query_params, 'workspace')
        recent = parse_bool_or_400(self.request.query_params, 'recent', False)
        starred = parse_bool_or_400(self.request.query_params, 'starred', False)
        limit = parse_int_or_400(self.request.query_params, 'limit', None)
        user_id = parse_int_or_400(self.request.query_params, 'user')

        # check permissions
        if workspace_id is not None:
            if not WorkspaceMembership.objects.filter(workspace_id=workspace_id, user_id=self.request.user.id).exists():
                raise PermissionDenied(detail="You do not belong to this workspace or this workspace doesn't exist.")
            return self.model.objects.filter(workspace_id=workspace_id)

        if user_id is not None:
            if user_id != self.request.user.id:
                raise PermissionDenied()
        else:
            user_id = self.request.user.id

        if starred:
            boards = [bm.board for bm in BoardMembership.objects.filter(user_id=user_id, starred=starred)]
            return boards[:limit] if limit is not None else boards

        if recent:
            boards = [bm.board for bm in BoardMembership.objects.filter(user_id=user_id).order_by('-updated')]
            return boards[:limit] if limit is not None else boards

    def perform_create(self, serializer):
        board = serializer.save()
        BoardMembership.objects.create(board=board, user=self.request.user, role=BoardMembership.ROLE.ADMIN)

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj


class WorkspaceViewSet(ModelViewSet):
    model = Workspace

    def get_serializer_class(self):
        if self.action == 'list':
            return WorkspaceBoardSerializer
        return WorkspaceSerializer

    def get_queryset(self):
        user_id = parse_int_or_400(
            self.request.query_params, 'user', self.request.user.id)
        return [wm.workspace for wm in WorkspaceMembership.objects.filter(user_id=user_id)]

    def perform_create(self, serializer):
        workspace = serializer.save()
        WorkspaceMembership.objects.create(
            workspace=workspace, user=self.request.user, role=WorkspaceMembership.ROLE.ADMIN)

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        workspace_membership_list = WorkspaceMembership.objects.filter(
            workspace=self.kwargs['pk'])
        for workspace_membership in workspace_membership_list:
            if workspace_membership.user.id == self.request.user.id:
                return obj
        raise PermissionDenied(
            detail="You do not belong to this workspace or this workspace doesn't exist.")

    def perform_destroy(self, instance):
        # check permission
        workspace_membership = WorkspaceMembership.objects.filter(
            user=self.request.user, workspace_id=self.kwargs['pk'])
        if not workspace_membership.exists() or workspace_membership.first() != WorkspaceMembership.ROLE.ADMIN:
            raise PermissionDenied(
                "You don't have permission to delete this workspace")

        wm = workspace_membership.first()
        object = wm.workspace
        object.delete()

    @action(detail=True, methods=['put'], url_path='settings')
    def update_settings_of_workspace(self, request, pk):
        workspace_membership = WorkspaceMembership.objects.filter(
            user=self.request.user, workspace_id=pk)
        if not workspace_membership.exists() or workspace_membership.first() != WorkspaceMembership.ROLE.ADMIN:
            raise PermissionDenied(
                "You don't have permission to delete this workspace")
        object = workspace_membership.workspace
        serializer = WorkspaceSerializer(object, request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get', 'post'], url_path='members')
    def handle_members(self, request, pk):
        if self.request.method == 'GET':
            return self.get_members_of_workspace(request, pk)

        if self.request.method == 'POST':
            return self.add_member_to_workspace(request, pk)

        raise PermissionDenied(detail="Unsupported method")

    def add_member_to_workspace(self, request, pk):
        self.get_object()
        member_id = parse_int_or_400(request.data, 'id')
        member = get_object_or_404(CustomUser, id=member_id)
        workspace_membership = WorkspaceMembership.objects.filter(
            user=member_id, workspace=pk)

        if workspace_membership.exists():
            return Response({'detail': 'This user is already added to workspace'}, status=status.HTTP_400_BAD_REQUEST)

        WorkspaceMembership.objects.create(
            user_id=member_id, workspace_id=pk, role=WorkspaceMembership.ROLE.MEMBER)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_members_of_workspace(self, request, pk):
        self.get_object()
        result = [
            wm.user_id for wm in WorkspaceMembership.objects.filter(workspace=pk)]
        return Response(data=result)

    @action(detail=False, methods=['get'], url_path='')
    def get_workspaces(self, request):
        user_id = self.request.user.id
        result = [wm.workspace_id for wm in WorkspaceMembership.objects.filter(
            user_id=user_id)]
        result = Workspace.objects.filter(id__in=result)
        serializer = WorkspaceBoardSerializer(result, many=True)
        return Response(serializer.data)


class CardViewSet(ModelViewSet):
    model = Card

    def get_serializer_class(self):
        if self.action == 'create':
            return CardCreateSerializer
        return CardSerializer

    def get_queryset(self):

        return

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=True, methods=['post'], url_path='labels')
    def add_label_to_card(self, request, pk):
        label_id = parse_int_or_400(request.data, 'id')
        label = get_object_or_404(Label, id=label_id)

        card_label = CardLabelRelationship.objects.filter(
            card_id=pk, label_id=label_id)
        board = card_label.card.list.board
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=board)
        if board_membership.exists() and label.board.id == board.id:
            if not card_label.exists():
                card_label = CardLabelRelationship.objects.create(
                    card_id=pk, label_id=label_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['post'], url_path='members')
    def add_member_to_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')

        card_membership = CardMembership.objects.filter(
            card_id=pk, user_id=member_id)
        card_membership_current = CardMembership.objects.get(
            card_id=pk, user_id=request.user
        )
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=card_membership_current.card.list.board)
        if board_membership.exists():
            if not card_membership.exists():
                card_membership_new = CardMembership.objects.create(
                    card_id=pk, user_id=member_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['delete'], url_path='labels')
    def delete_label_from_card(self, request, pk):
        label_id = parse_int_or_400(request.data, 'id')
        card_label = CardLabelRelationship.objects.filter(
            card_id=pk, label_id=label_id)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=card_label.card.list.board)
        if board_membership.exists():
            if card_label.exists():
                card_label.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['delete'], url_path='members')
    def delete_member_from_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')
        card_membership = CardMembership.objects.filter(
            card_id=pk, user_id=member_id)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=card_membership.card.list.board)
        if board_membership.exists():
            if card_membership.exists():
                card_membership.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")


class ListViewSet(ModelViewSet):
    model = List

    def get_serializer_class(self):
        if self.action == 'create':
            return ListCreateSerializer
        return ListSerializer

    def get_queryset(self):

        return

    def perform_create(self, serializer):
        list = serializer.save()

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    # Copy a list is not currently available for local API test since related
    # CRUD APIs haven't been deploy.

    @action(detail=True, methods=['post'], url_path='copy-list')
    def copy_a_list(self, request, pk):
        list = List.objects.filter(id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=list[0].board)
        if board_membership.exists():
            new_list = List.objects.create(name=list.name, board=list.board)
            # Create card, card membership, checklist.
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['post'], url_path='sort-cards')
    @transaction.atomic
    def sort_cards_in_list(self, request, pk):
        sort_mode = parse_int_or_400(request.data, 'mode')
        """
            Mode 1: Date created newest
            Mode 2: Date created oldest
            Mode 3: Card name (Alphabetically)
        """
        cards = Card.objects.filter(list=pk)
        list = List.objects.get(id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=list.board)
        if board_membership.exists():
            if sort_mode == 1:
                pst = 0
                for card in cards.order_by('-start'):
                    print(card)
                    card.position = pst
                    card.save()
                    pst += 1
            elif sort_mode == 2:
                pst = 0
                for card in cards.order_by('start'):
                    print(card)
                    card.position = pst
                    card.save()
                    pst += 1
            elif sort_mode == 3:
                pst = 0
                for card in cards.order_by('title'):
                    card.position = pst
                    card.save()
                    pst += 1
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['post'], url_path='move-cards')
    @transaction.atomic
    def move_all_cards(self, request, pk):
        list_id_dest = parse_int_or_400(request.data, 'id')
        cards = Card.objects.filter(list=pk)
        list = List.objects.get(id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=list.board)
        if board_membership.exists():
            cards.update(list=list_id_dest)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['post'], url_path='archive-lists')
    def archive_a_list(self, request, pk):
        list = List.objects.filter(id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=list[0].board)
        if board_membership.exists():
            list.update(archive=True)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")


class CommentViewSet(ModelViewSet):
    model = Comment

    def get_serializer_class(self):
        return CommentSerializer

    def get_queryset(self):

        return

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=True, methods=['get'], url_path='')
    def get_comments_in_card(self, request):
        card_id = parse_int_or_400(request.query_params, 'card')
        query_kwargs = {
            'card_id': card_id
        }
        obj = get_object_or_404(self.model, **query_kwargs)
        return obj


class ChecklistViewSet(ModelViewSet):
    model = Checklist

    def get_serializer_class(self):
        return ChecklistSerializer

    def get_queryset(self):

        return

    @action(detail=True, methods=['get'], url_path='')
    def get_checklists_in_card(self, request):
        card_id = parse_int_or_400(request.query_params, 'card')
        query_kwargs = {
            'card_id': card_id
        }
        obj = get_object_or_404(self.model, **query_kwargs)
        return obj


class ChecklistItemViewSet(ModelViewSet):
    model = ChecklistItem

    def get_serializer_class(self):
        return ChecklistItemSerializer

    def get_queryset(self):

        return

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=True, methods=['get'], url_path='')
    def get_items_in_checklist(self, request):
        checklist_id = parse_int_or_400(request.query_params, 'checklist')
        query_kwargs = {
            'checklist_id': checklist_id
        }
        obj = get_object_or_404(self.model, **query_kwargs)
        return obj


class LabelViewSet(ModelViewSet):
    model = Label

    def get_serializer_class(self):
        return LabelSerializer

    def get_queryset(self):
        board_membership_list = BoardMembership.objects.filter(
            user_id=self.request.user)
        result = list()
        for board_membership in board_membership_list:
            if self.request.user.id == board_membership.user.id:
                result += Label.objects.filter(board=board_membership.board)
        return result

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        board_membership_list = BoardMembership.objects.filter(board=obj.board)
        for board_membership in board_membership_list:
            if board_membership.user.id == self.request.user.id:
                return obj
        raise PermissionDenied(
            detail="You do not belong to this board or this board doesn't exist.")

    def perform_create(self, serializer):
        board_id = parse_int_or_400(self.request.data, 'board')
        board = Board.objects.get(id=board_id)
        board_membership = BoardMembership.objects.filter(
            user_id=self.request.user, board=board)
        if not board_membership.exists():
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
        if 'card' not in self.request.data:
            label = serializer.save()
        else:
            card_id = parse_int_or_400(self.request.data, 'card')
            board_of_card = get_object_or_404(Card, pk=card_id).list.board
            if len(CardLabelRelationship.objects.filter(card=card_id)) > 0:
                raise PermissionDenied(
                    detail="This label already has label.")
            if board_of_card != board:
                raise PermissionDenied(
                    detail="You can not create label for this card.")
            label = serializer.save()
            CardLabelRelationship.objects.create(
                card_id=card_id, label_id=label.id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_update(self, serializer):
        board_id = parse_int_or_400(self.request.data, 'board')
        board_dst = Board.objects.get(id=board_id)
        board_src = get_object_or_404(Label, pk=self.kwargs['pk']).board
        board_membership_dst = BoardMembership.objects.filter(
            user_id=self.request.user, board=board_dst)
        board_membership_src = BoardMembership.objects.filter(
            user_id=self.request.user, board=board_src)

        if not board_membership_src.exists() or not board_membership_dst.exists():
            raise PermissionDenied(
                detail="You do not belong to these boards or these board doesn't exist.")
        serializer.save()

    def perform_destroy(self, serializer):
        label = get_object_or_404(Label, pk=self.kwargs['pk'])
        board = label.board
        board_membership = BoardMembership.objects.filter(
            user_id=self.request.user, board=board)
        if not board_membership.exists():
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
        label.delete()
