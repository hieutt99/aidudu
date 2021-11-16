from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
import requests
from django.urls import reverse
import json
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from utilities.request import parse_bool_or_400, parse_int_or_400

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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        res_data = json.loads(requests.post(request.build_absolute_uri(reverse('login')), json=request.data).content)

        return Response({
            'access': res_data['access'],
            'refresh': res_data['refresh'],
            'user': UserSerializer(user, context=self.get_serializer_context()).data
        }, status=status.HTTP_201_CREATED)



class ForgotPasswordView(APIView):
    def post(self, request, format=None):
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

        if workspace_id is not None:
            if not WorkspaceMembership.objects.filter(workspace_id=workspace_id, user_id=self.request.user.id).exists():
                raise PermissionDenied(detail="You do not belong to this workspace or this workspace doesn't exist.")
            return self.model.objects.filter(workspace_id=workspace_id)
        
        # check permission
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
            

class WorkspaceViewSet(ModelViewSet):
    model = Workspace

    def get_serializer_class(self):
        return WorkspaceSerializer
    
    def get_queryset(self):
        user_id = parse_int_or_400(self.request.query_params, 'user')

        if user_id is None:
            user_id = self.request.user.id
        
        return [wm.workspace for wm in WorkspaceMembership.objects.filter(user_id=user_id)]
    
    def perform_create(self, serializer):
        workspace = serializer.save()
        WorkspaceMembership.objects.create(workspace=workspace, user=self.request.user, role=WorkspaceMembership.ROLE.ADMIN)

class CardViewSet(ModelViewSet):
    model = Card

    def get_serializer_class(self):
        if self.action=='create':
            return CardCreateSerializer
        return CardSerializer

    # def get_queryset(self):
        
    #     return 

    @action(detail=True, methods=['post'], url_path='labels')
    def add_label_to_card(self, request, pk):
        label_id = parse_int_or_400(request.data, 'id')
        label = get_object_or_404(Label, id=label_id)

        card_label = CardLabelRelationship.objects.filter(card_id=pk, label_id=label_id)
        board = card_label.card.list.board
        board_membership = BoardMembership.objects.filter(user_id=request.user, board=board)
        if board_membership.exists() and label.board.id == board.id:
            if not card_label.exists():
                card_label = CardLabelRelationship.objects.create(card_id=pk, label_id=label_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")


    @action(detail=True, methods=['post'], url_path='members')
    def add_member_to_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')
        member = get_object_or_404(CustomUser, id=member_id)

        card_membership = CardMembership.objects.filter(card_id=pk, user_id=member_id)
        board_membership = BoardMembership.objects.filter(user_id=request.user, board=card_membership.card.list.board)
        if board_membership.exists():
            if not card_membership.exists():
                card_membership = CardMembership.objects.create(card_id=pk, user_id=member_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['delete'], url_path='labels')
    def delete_label_from_card(self, request, pk):
        label_id = parse_int_or_400(request.data, 'id')
        card_label = CardLabelRelationship.objects.filter(card_id=pk, label_id=label_id)
        board_membership = BoardMembership.objects.filter(user_id=request.user, board=card_label.card.list.board)
        if board_membership.exists():
            if card_label.exists():
                card_label.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")

    @action(detail=True, methods=['delete'], url_path='members')
    def delete_member_from_card(self, request, pk):
        member_id = parse_int_or_400(request.data, 'id')
        card_membership = CardMembership.objects.filter(card_id=pk, user_id=member_id)
        board_membership = BoardMembership.objects.filter(user_id=request.user, board=card_membership.card.list.board)
        if board_membership.exists():
            if card_membership.exists():
                card_membership.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied(detail="You do not belong to this board or this board doesn't exist.")

