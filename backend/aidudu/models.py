import os
from PIL import Image
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.fields import related
from django.urls.base import reverse
from model_utils import Choices
import math 
from datetime import timedelta 
from django.utils.timezone import now, utc, timedelta

def dynamic_workspace_filepath(instance, filename):
    # pattern: <user_id>/<task_id>/filename
    filepath = os.path.join('workspaces', str(instance.pk), filename)
    return filepath

def dynamic_board_filepath(instance, filename):
    # pattern: <user_id>/<task_id>/filename
    filepath = os.path.join('boards', str(instance.pk), filename)
    return filepath

class CustomUser(AbstractUser):
    email = models.EmailField('Email address', unique=True)
    avatar = models.ImageField(default='profile_pics/default.jpg', upload_to='profile_pics/')

    def __str__(self):
        return f"{self.username} ({self.id})"

    def save(self, *args, **kwargs):
        super(CustomUser, self).save(*args, **kwargs)

        # shrink avatar image if it's too large
        img = Image.open(self.avatar.path)

        if img.height > 300 or img.height > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.avatar.path)

class Workspace(models.Model):
    PUBLIC = 'public'
    PRIVATE = 'private'

    VISIBILITY = Choices(
        (PUBLIC, 'Public'),
        (PRIVATE, 'Private'),
    )

    name = models.CharField(default='', max_length=256)
    members = models.ManyToManyField(CustomUser, through='WorkspaceMembership')
    visibility = models.CharField(max_length=64, default='public', choices=VISIBILITY)
    logo = models.ImageField(upload_to=dynamic_workspace_filepath, null=True, blank=True)

    def __str__(self):
        return f"Workspace {self.name} ({self.id})"

class WorkspaceMembership(models.Model):
    ADMIN = 'admin'
    MEMBER = 'member'

    ROLES = Choices(
        (ADMIN, 'Admin'),
        (MEMBER, 'Member'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='workspace_members')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace')
    role = models.CharField(max_length=64, default='admin', choices=ROLES)
    joined = models.DateField(auto_now_add=True, blank=True)
    
    class Meta:
        unique_together = ('user', 'workspace', 'role')

    def __str__(self):
        return f'WorkspaceMembership ({self.id})'

class Board(models.Model):
    name = models.CharField(default='', max_length=256)
    background = models.ImageField(upload_to=dynamic_board_filepath, null=True, blank=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.SET_NULL, blank=True, default=None, related_name='boards')
    members = models.ManyToManyField(CustomUser, through='BoardMembership')
    def __str__(self):
        return f"Board {self.name} ({self.id})"

class BoardMembership(models.Model):
    ADMIN = 'admin'
    MEMBER = 'member'

    ROLES = Choices(
        (ADMIN, 'Admin'),
        (MEMBER, 'Member'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='board_members')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='board')
    role = models.CharField(max_length=64, default='admin', choices=ROLES)
    joined = models.DateField(auto_now_add=True, blank=True)
    
    class Meta:
        unique_together = ('user', 'board', 'role')

    def __str__(self):
        return f'BoardMembership ({self.id})'

class List(models.Model):
    name = models.CharField(default='', max_length=256)
    board = models.ForeignKey(Board, on_delete=models.SET_NULL, blank=True, default=None, related_name='lists')
    def __str__(self):
        return f"List {self.name} ({self.id})"

class Label(models.Model):
    name = models.CharField(default='', max_length=256)
    color = models.CharField(default='', max_length=64)
    
    def __str__(self):
        return f"Label {self.name} ({self.id})"

class Card(models.Model):
    title = models.CharField(default='', max_length=256)
    description = models.CharField(default='', max_length=256)
    start_date = models.DateField(auto_now_add=True, blank=True)
    due_date = models.DateField(blank=True, default=None)
    done = models.BooleanField(default=False) 
    list = models.ForeignKey(Board, on_delete=models.SET_NULL, blank=True, default=None, related_name='cards')
    labels = models.ManyToManyField(Label, through='CardLabel')
    def __str__(self):
        return f"Card {self.title} ({self.id})"

class CardLabel(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='labels')
    label = models.ForeignKey(Label, on_delete=models.CASCADE, related_name='card_labels')

    class Meta:
        unique_together = ('card', 'label')

    def __str__(self):
        return f'CardLabel ({self.id})'

class Checklist(models.Model):
    title = models.CharField(default='', max_length=256)
    card = models.ForeignKey(Card, on_delete=models.SET_NULL, blank=True, default=None, related_name='checklists')
    def __str__(self):
        return f'Checklist {self.title} ({self.id})'

class Item(models.Model):
    content = models.CharField(default='', max_length=256)
    checked = models.BooleanField(default=False)
    checklist = models.ForeignKey(Checklist, on_delete=models.SET_NULL, blank=True, default=None, related_name='items')
    def __str__(self):
        return f'Item {self.content} ({self.id})'

class Comment(models.Model):
    content = models.CharField(default='', max_length=256)
    card = models.ForeignKey(Card, on_delete=models.SET_NULL, blank=True, default=None, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, default=None, related_name='comments')

    def __str__(self):
        return f'Comment {self.content} ({self.id})'

class Attachment(models.Model):
    url = models.URLField(max_length = 200)
    card = models.ForeignKey(Card, on_delete=models.SET_NULL, blank=True, default=None, related_name='attachments')
    def __str__(self):
        return f'Attachment {self.card} ({self.id})'