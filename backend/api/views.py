import json
from django.db.models.functions.text import Repeat
import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat   
from django.shortcuts import get_list_or_404, get_object_or_404
from django.urls import reverse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.serializers import ListSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from utilities.request import (parse_bool_or_400, parse_int_array_or_400, parse_int_or_400,
                               parse_string_array_or_400)

from api.models import *
from api.serializers import *


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50
    page_query_param = 'page'


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
        return [bm.board for bm in BoardMembership.objects.filter(user_id=user_id)]
    def perform_create(self, serializer):
        board = serializer.save()
        BoardMembership.objects.create(board=board, user=self.request.user, role=BoardMembership.ROLE.ADMIN)

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        data = self.request.data
        obj = self.get_object_with_permission()
        workspace_src = get_object_or_404(Board, pk=self.kwargs['pk']).workspace
        if 'background' in data:
            serializer.save(workspace_id = workspace_src.id)
            return
        if 'starred' in data:
            starred_new = self.request.data['starred']
            if starred_new.lower() == 'true':
                starred_new = True
            elif starred_new.lower() == 'false':
                starred_new = False
            else:
                return
            star_info = BoardMembership.objects.filter(user_id=self.request.user.id, board = obj)
            if not star_info.exists():
                raise PermissionDenied(
                    detail="You do not belong to this board or this board doesn't exist.")
            else:
                star_info.update(starred=starred_new)
                return Response(status=status.HTTP_204_NO_CONTENT)
            return
    def get_object_with_permission(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        membership = BoardMembership.objects.filter(user_id = self.request.user.id, board = obj)
        if not membership.exists():
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
        return obj

    @action(detail=True, methods=['get'], url_path='details')
    def get_details_of_a_board(self, request, pk):
        object = self.get_object_with_permission()
        serializer = BoardDetailViewSerializer(object, context={'request': request})
        return Response(data=serializer.data)

    @action(detail=True, methods=['post'], url_path='leave')
    def leave_a_booard(self, request, pk):
        membership = BoardMembership.objects.filter(
            user=self.request.user, board_id=pk)
        if not membership.exists():
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['put'], url_path='update_cards')
    def update_multiple_cards(self, request, pk):
        if not BoardMembership.objects.filter(user_id=request.user, board_id=pk).exists():
            raise PermissionDenied("You don't belong to this board")

        update_dict = {item['id']:item['position'] for item in request.data}
        cards = Card.objects.filter(id__in=list(update_dict.keys()))
        
        with transaction.atomic():
            for card in cards:
                card.position = update_dict[card.id]
                card.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_members_of_board(self, request, pk):
        board = get_object_or_404(Board, id=pk)
        boardmembership = BoardMembership.objects.filter(
            user_id=request.user, board_id=board.id
        )
        if boardmembership.exists():
            memberships = BoardMembership.objects.filter(
                board_id=board.id
            )
            serializer = BoardMembershipSerializer(memberships, many=True)
            return Response(data=serializer.data)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
 

    def add_members_to_board(self, request, pk):
        board = get_object_or_404(Board, id=pk)
        boardmembership = BoardMembership.objects.filter(
            user_id=request.user, board_id=board.id
        )
        if boardmembership.exists() and 'id' in request.data.keys():
            ids = [request.data['id']] if isinstance(request.data['id'], int) \
                else request.data['id']
            if isinstance(ids, list) and len(ids)>0:
                memberships = BoardMembership.objects.filter(user_id__in=ids, board_id=board.id)
                # id da ton tai 
                changes = [item.id for item in memberships]
                # id can the ma chua ton tai
                changes = [i for i in ids if i not in changes]
                for change in changes:
                    BoardMembership.objects.create(
                        user_id=change, board_id=board.id
                    )
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(
                detail="You do not belong to this board or this board doesn't exist.")
    def remove_members_from_board(self, request, pk):
        board = get_object_or_404(Board, id=pk)
        boardmembership = BoardMembership.objects.filter(
            user_id=request.user, board_id=board.id
        )
        if boardmembership.exists() and 'id' in request.data.keys():
            ids = [request.data['id']] if isinstance(request.data['id'], int) \
                else request.data['id']
            if isinstance(ids, list) and len(ids)>0:
                memberships = BoardMembership.objects.filter(user_id__in=ids, board_id=board.id)
                # id da ton tai 
                changes = [item for item in memberships]
                for change in changes:
                    change.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get', 'post', 'delete'], url_path='members')
    def handle_members(self, request, pk):
        if self.request.method == 'POST':
            return self.add_members_to_board(request, pk)
        elif self.request.method == 'GET':
            return self.get_members_of_board(request, pk)
        elif self.request.method == 'DELETE':
            return self.remove_members_from_board(request, pk)
        raise PermissionDenied(detail="Unsupported method")

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
        if not workspace_membership.exists() or workspace_membership.first().role != WorkspaceMembership.ROLE.ADMIN:
            raise PermissionDenied(
                "You don't have permission to delete this workspace")

        wm = workspace_membership.first()
        object = wm.workspace
        object.delete()

    @action(detail=True, methods=['put'], url_path='settings')
    def update_settings_of_workspace(self, request, pk):
        workspace_membership = WorkspaceMembership.objects.filter(
            user=self.request.user, workspace_id=pk)
        if not workspace_membership.exists():
            raise PermissionDenied(
                "You don't belong to this workspace")
        if workspace_membership.first().role != WorkspaceMembership.ROLE.ADMIN:
            raise PermissionDenied(
                "You don't have permission to update this workspace")
        object = workspace_membership.first().workspace
        serializer = WorkspaceSerializer(object, request.data, partial=True)
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
        memberships = WorkspaceMembership.objects.filter(workspace=pk)
        serializer = WorkspaceMembershipSerializer(memberships, many=True, context={'request': request})
        return Response(data=serializer.data)

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

        return Card.objects.all()

    def perform_create(self, serializer):
        card = serializer.save()
        list = card.list
        with transaction.atomic():
            cards_in_list = [c for c in list.cards.all() if c.id!=card.id]
            card.position = len(cards_in_list)
            card.save()

    def perform_update(self, serializer):
        card_src = get_object_or_404(Card, pk=self.kwargs['pk'])
        list_src = card_src.list
        position_src = card_src.position

        card = serializer.save()
        list = card.list 

        if card.list.id != list_src.id:
            with transaction.atomic():
                cards_in_list = [c for c in list.cards.all() if 
                                c.id!=card.id and c.position >= card.position]
                for c in cards_in_list:
                    c.position+=1
                    c.save()

                cards_in_old_list = [c for c in list_src.cards.all() if c.position > position_src]

                for c in cards_in_old_list:
                    c.position-=1
                    c.save()
        elif position_src != card.position:
            with transaction.atomic():
                if position_src < card.position: 
                    # di chuyen xuong 
                    cards_in_list = [c for c in list.cards.all() if c.id!=card.id and c.position > position_src and c.position <= card.position]
                    for c in cards_in_list:
                        c.position-=1
                        c.save()

                if position_src > card.position:
                    # di chuyen len 
                    cards_in_list = [c for c in list.cards.all() if c.id!=card.id and c.position>=card.position and c.position<position_src]
                    for c in cards_in_list:
                        c.position+=1
                        c.save()

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def add_label_to_card(self, request, pk):

        label_id = parse_int_or_400(request.data, 'id')
        label = get_object_or_404(Label, id=label_id)
        
        card = get_object_or_404(Card, id=pk)
        card_label = CardLabelRelationship.objects.filter(
            card_id=pk, label_id=label_id)
        board = card.list.board
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
 
    def add_member_to_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')
        card = get_object_or_404(Card, id=pk)

        board_membership = BoardMembership.objects.filter(
            board_id=card.list.board.id, user_id=member_id)
        board_membership_current = BoardMembership.objects.filter(
            board_id=card.list.board.id, user_id=request.user
        )
        card_membership = CardMembership.objects.filter(
            card_id=pk, user_id=member_id
        )
        if not board_membership_current.exists():
            raise PermissionDenied(
                detail="You do not belong to this board.")
        elif not board_membership.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            if not card_membership.exists():
                card_membership = CardMembership.objects.create(
                    card_id=pk, user_id=member_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
            
    def delete_label_from_card(self, request, pk):
        label_id = parse_int_or_400(request.data, 'id')
        card_label = CardLabelRelationship.objects.filter(
            card_id=pk, label_id=label_id)
        if not card_label.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            card_label = card_label.first()
            board_membership = BoardMembership.objects.filter(
                user_id=request.user, board=card_label.card.list.board)
            if board_membership.exists():
                card_label.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                raise PermissionDenied(
                    detail="You do not belong to this board or this board doesn't exist.")

    def delete_member_from_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')
        card_membership = CardMembership.objects.filter(
            card_id=pk, user_id=member_id)
        # print(card_membership)
        if not card_membership.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            card_membership = card_membership.first()
            board_membership = BoardMembership.objects.filter(
                user_id=request.user, board=card_membership.card.list.board)
            if board_membership.exists():
                card_membership.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                raise PermissionDenied(
                    detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['post', 'delete'], url_path='labels')
    def handle_labels_in_card(self, request, pk):
        if self.request.method == 'POST':
            return self.add_label_to_card(request, pk)
        if self.request.method == 'DELETE':
            return self.delete_label_from_card(request, pk)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['post', 'delete'], url_path='members')
    def handle_members_in_card(self, request, pk):
        if self.request.method == 'POST':
            return self.add_member_to_card(request, pk)
        if self.request.method == 'DELETE':
            return self.delete_member_from_card(request, pk)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['get'], url_path='details')
    def get_details_of_a_card(self, request, pk):
        card = get_object_or_404(Card, id=pk)
        board_membership = BoardMembership.objects.filter(user_id=request.user, board=card.list.board)
        if not board_membership.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
    
        serializer = CardDetailViewSerializer(card, context={'request': request})
        return Response(data=serializer.data)
    
    @action(detail=True, methods=['post'], url_path='archive')
    def archive_a_card(self, request, pk):
        card = get_object_or_404(Card, id=pk)
        board_membership = BoardMembership.objects.filter(user=request.user, board=card.list.board)
        if not board_membership.exists():
            raise PermissionDenied(detail="You do not belogn to this board or this board doesn't exist.")
        card.archived = True
        card.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='checklists')
    def get_checklists_from_card(self, request, pk):
        card = get_object_or_404(Card, id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board_id=card.list.board.id
        )
        if board_membership.exists():
            serializer = ChecklistDetailSerializer(card.checklists, many=True)
            print(serializer)
            return Response(data=serializer.data)
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")

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
        board = list.board 
        lists_in_board = [l for l in board.lists.all() if l.id!= list.id]
        list.position = len(lists_in_board)
        list.save()

    def perform_update(self, serializer):
        list_src = get_object_or_404(List, pk=self.kwargs['pk'])
        position_src = list_src.position

        list = serializer.save()
        board = list.board 
        if position_src > list.position:
            # di chuyen sang trai 
            with transaction.atomic():
                lists_in_board = [l for l in board.lists.all() if l.id!=list.id and l.position>=list.position and l.position<position_src]
                for l in lists_in_board:
                    l.position+=1
                    l.save()
        elif position_src < list.position:
            # di chuyen sang phai 
            with transaction.atomic():
                lists_in_board = [l for l in board.lists.all() if l.id!=list.id and l.position>position_src and l.position <= list.position]
                for l in lists_in_board:
                    l.position-=1
                    l.save()



    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
        
    @action(detail=True, methods=['post'], url_path='copy-list')
    def copy_a_list(self, request, pk):
        list = List.objects.get(id=pk)
        board_membership = BoardMembership.objects.filter(
            user_id=request.user, board=list.board)
        if board_membership.exists():
            list_pk = list.pk
            #Clone the list
            copy_list = list
            copy_list.pk = None
            copy_list.save()
            #Clone all card in that list
            cards = Card.objects.filter(list=List.objects.get(id=list_pk))
            for card in cards:
                card_pk = card.pk
                copy_card = card
                copy_card.pk = None
                copy_card.list = copy_list
                copy_card.save()
                #Clone all card memberships
                cardmems = CardMembership.objects.filter(card=Card.objects.get(id=card_pk))
                for cardmem in cardmems:
                    copy_cardmem = cardmem
                    copy_cardmem.pk = None
                    copy_cardmem.card = copy_card
                    copy_cardmem.save()
                #Clone all card-label relationship
                clrelas = CardLabelRelationship.objects.filter(card=Card.objects.get(id=card_pk))
                for clrela in clrelas:
                    copy_clrela = clrela
                    copy_clrela.pk = None
                    copy_clrela.card = copy_card
                    copy_clrela.save()
                #Clone checklists of each card
                checklists = Checklist.objects.filter(card=Card.objects.get(id=card_pk))
                for checklist in checklists:
                    checklist_pk = checklist.pk
                    copy_checklist = checklist
                    copy_checklist.pk = None
                    copy_checklist.card = copy_card
                    copy_checklist.save()
                    #Clone checklist items of each checklist
                    ckls = ChecklistItem.objects.filter(checklist=Checklist.objects.get(id=checklist_pk))
                    for ckl in ckls:
                        copy_ckl = ckl
                        copy_ckl.pk = None
                        copy_ckl.checklist = copy_checklist
                        copy_ckl.save()
                #Clone comments of each card
                cmts = Comment.objects.filter(card=Card.objects.get(id=card_pk))
                for cmt in cmts:
                    copy_cmt = cmt
                    copy_cmt.pk = None
                    copy_cmt.card = copy_card
                    copy_cmt.save()
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
        board_membership = BoardMembership.objects.filter(user=request.user, board=list.board)
        if not board_membership.exists():
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")
        cards.update(list=list_id_dest)
        return Response(status=status.HTTP_204_NO_CONTENT)
            

    @action(detail=True, methods=['post'], url_path='archive')
    def archive_a_list(self, request, pk):
        list = List.objects.filter(id=pk)
        board_membership = BoardMembership.objects.filter(user=request.user, board=list[0].board)
        if not board_membership.exists():
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")
        list.update(archived=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(ModelViewSet):
    model = Comment

    def get_serializer_class(self):
        return CommentSerializer

    def get_queryset(self):
        card_id = parse_int_or_400(self.request.query_params, 'card')
        objs = [comm for comm in Comment.objects.filter(card_id=card_id)]
        return objs

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

class ChecklistViewSet(ModelViewSet):
    model = Checklist

    def get_serializer_class(self):
        return ChecklistSerializer

    def get_queryset(self):
        card_id = parse_int_or_400(self.request.query_params, 'card')
        objs = [checklist for checklist in Checklist.objects.filter(card_id=card_id)]
        return objs

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        checklist = serializer.save()
        card = checklist.card
        checklists_in_card = [c for c in card.checklists.all() if c.id!=checklist.id]
        checklist.position = len(checklists_in_card)
        checklist.save()
    
    def perform_update(self, serializer):
        card_id = self.request.data['card']
        card = get_object_or_404(Card, id=card_id)
        board_membership = BoardMembership.objects.filter(
            user_id=self.request.user, board_id=card.list.board.id
        )
        if board_membership.exists():
            checklist = get_object_or_404(Checklist, pk=self.kwargs['pk'])
            old_position = checklist.position

            checklist = serializer.save()
            # di chuyen vi tri
            card = checklist.card 
            if old_position > checklist.position:
                # di chuyen len 
                with transaction.atomic():
                    checklists_in_card = [c for c in card.checklists.all() if c.id!=checklist.id and c.position>=checklist.position and c.position<old_position]
                    for c in checklists_in_card:
                        c.position+=1
                        c.save()

            elif old_position < checklist.position:
                # di chuyen xuong 
                with transaction.atomic():
                    checklists_in_card = [c for c in card.checklists.all() if c.id!=checklist.id and c.position>old_position and c.position<=checklist.position]
                    for c in checklists_in_card:
                        c.position-=1
                        c.save()
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")
    
    def perform_destroy(self, serializer):
        checklist = get_object_or_404(Checklist, pk=self.kwargs['pk'])
        card = checklist.card 
        board_membership = BoardMembership.objects.filter(
            user_id=self.request.user, board_id=card.list.board.id
        )
        if board_membership.exists():
            checklists_in_card = [c for c in card.checklists.all() if c.id!=checklist.id and c.position>checklist.position]
            with transaction.atomic():
                for c in checklists_in_card:
                    c.position-=1
                    c.save()
                checklist.delete()
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")


class ChecklistItemViewSet(ModelViewSet):
    model = ChecklistItem

    def get_serializer_class(self):
        if self.action == 'create':
            return ChecklistItemCreateSerializer
        return ChecklistItemSerializer

    def get_queryset(self):
        checklist_id = parse_int_or_400(self.request.query_params, 'checklist')
        objs = [item for item in ChecklistItem.objects.filter(checklist_id=checklist_id)]
        return objs

    def get_object(self):
        obj = get_object_or_404(self.model, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        old_item = get_object_or_404(ChecklistItem, pk=self.kwargs['pk'])
        old_position = old_item.position
        item = serializer.save()
        checklist = item.checklist
        if item.position<old_position:
            # di chuyen len 
            items_in_checklist = [i for i in checklist.items.all() if i.id!=item.id and i.position>=item.position and i.position<old_position]
            with transaction.atomic():
                for i in items_in_checklist:
                    i.position+=1
                    i.save()
        elif item.position>old_position:
            # di chuyen xuong 
            items_in_checklist = [i for i in checklist.items.all() if i.id!=item.id and i.position>old_position and i.position<=item.position]
            with transaction.atomic():
                for i in items_in_checklist:
                    i.position-=1
                    i.save()

    def perform_create(self, serializer):
        item = serializer.save()
        checklist = item.checklist 
        items_in_checklist = [i for i in checklist.items.all() if i.id!=item.id]
        item.position = len(items_in_checklist)
        item.save()

    def perform_destroy(self, serializer):
        item = get_object_or_404(ChecklistItem, pk=self.kwargs['pk'])
        card = item.checklist.card
        board_membership = BoardMembership.objects.filter(
            user_id=self.request.user, board_id=card.list.board.id
        )
        if board_membership.exists():
            items_in_checklist = [i for i in item.checklist.items.all() if i.id!=item.id and i.position>item.position]
            with transaction.atomic():
                for i in items_in_checklist:
                    i.position-=1
                    i.save()
                item.delete()
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")


class UserViewSet(ModelViewSet):
    model = get_user_model()
    pagination_class = CustomPagination

    def get_serializer_class(self):
        return UserSerializer
    
    def get_queryset(self):
        query_string = self.request.query_params.get('query')

        if query_string is None:
            return Response({'detail': 'Missing required parameter "query".'}, status=status.HTTP_400_BAD_REQUEST)

        q = Q(is_active=True) & (Q(email__icontains=query_string)\
            | Q(username__icontains=query_string))\
            | Q(full_name__icontains=query_string)
        
        return self.model.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name')).filter(q).order_by('id')
            
    def get_object(self):
        """
        Returns the object the view is displaying.

        You may want to override this if you need to provide non-standard
        queryset lookups.  Eg if objects are referenced using multiple
        keyword arguments in the url conf.
        """
        # queryset = self.filter_queryset(self.get_queryset())
        queryset = self.model.objects.all()

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj

    @action(detail=True, methods=['get'], url_path='cards')
    def get_cards_of_user(self, request, pk):
        user = request.user
        if user.id == int(pk):
            cardmembership = CardMembership.objects.filter(user_id=user.id)
            cards = [item.card for item in cardmembership if item.card.archived==False]
            serializer = CardDetailViewSerializer(cards, many=True)
            return Response(data=serializer.data)
        else:
            raise PermissionDenied("Nah")

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
