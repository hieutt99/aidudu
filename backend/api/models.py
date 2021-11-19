import os
from PIL import Image
from django.db import models
from django.contrib.auth.models import AbstractUser

def dynamic_workspace_logo_filepath(instance, filename):
    """Return a dynamic logo filepath for workspace"""
    filepath = os.path.join('workspaces', 'logo', str(instance.pk), filename)
    return filepath

def dynamic_board_background_filepath(instance, filename):
    """Return a dynamic background filepath for board"""
    filepath = os.path.join('boards', 'background', str(instance.pk), filename)
    return filepath

def dynamic_attachment_filepath(instance, filename):
    """Return a dynamic filepath for attachment"""
    filepath = os.path.join('attachments', filename)
    return filepath


class CustomUser(AbstractUser):
    """Represent user in aidudu application"""

    email = models.EmailField('Email address', unique=True)
    avatar = models.ImageField(default='profile_pics/default.jpg', upload_to='profile_pics/')
    bio = models.CharField(default='', max_length=512)

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
    """Represent workspace"""

    class VISIBILITY(models.TextChoices):
        PUBLIC = 'public'
        PRIVATE = 'private'

    name = models.CharField(default='', max_length=128)
    members = models.ManyToManyField(CustomUser, through='WorkspaceMembership')
    visibility = models.CharField(max_length=64, default=VISIBILITY.PRIVATE, choices=VISIBILITY.choices)
    logo = models.ImageField(upload_to=dynamic_workspace_logo_filepath, null=True, blank=True)

    def __str__(self):
        return f"Workspace {self.name} ({self.id})"


class WorkspaceMembership(models.Model):
    """Represent the n-n relationship between workspace and member"""

    class ROLE(models.TextChoices):
        ADMIN = 'admin'
        MEMBER = 'member'
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='workspace_members')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspaces')
    role = models.CharField(max_length=16, default=ROLE.ADMIN, choices=ROLE.choices)
    joined = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'workspace', 'role')

    def __str__(self):
        return f'WorkspaceMembership ({self.id})'


class Board(models.Model):
    """Represent board"""

    name = models.CharField(default='', max_length=128)
    background = models.ImageField(upload_to=dynamic_board_background_filepath, null=True, blank=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='boards')
    members = models.ManyToManyField(CustomUser, through='BoardMembership')

    def __str__(self):
        return f"Board {self.name} ({self.id})"


class BoardMembership(models.Model):
    """Represent the n-n relationship between board and member"""

    class ROLE(models.TextChoices):
        ADMIN = 'admin'
        MEMBER = 'member'

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='board_members')
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='boards')
    role = models.CharField(max_length=16, default=ROLE.ADMIN, choices=ROLE.choices)
    starred = models.BooleanField(default=False)
    joined = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'board', 'role')

    def __str__(self):
        return f'BoardMembership ({self.id})'


class List(models.Model):
    """Represent list of board"""

    name = models.CharField(default='', max_length=128)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')
    position = models.IntegerField(default=0)

    def __str__(self):
        return f"List {self.name} ({self.id})"


class Label(models.Model):
    """Represent label of board"""

    class COLOR(models.TextChoices):
        TOMATO = 'tomato'
        FLAMINGO = 'flamingo'
        TANGERINE = 'tangerine'
        BANANA = 'banana'
        SAGE = 'sage'
        BASIL = 'basil'
        PEACOCK = 'peacock'
        BLUEBERRY = 'blueberry'
        GRAPHITE = 'graphite'
        GRAPE = 'grape'

    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    name = models.CharField(default='', max_length=32)
    color = models.CharField(default=COLOR.TOMATO, choices=COLOR.choices, max_length=16)
    
    def __str__(self):
        return f"Label {self.name} ({self.id})"


class Card(models.Model):
    """Represent card of list"""

    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(default='', max_length=128)
    description = models.CharField(default='', max_length=256)
    start = models.DateTimeField(blank=True, null=True)
    due = models.DateTimeField(blank=True, null=True)
    position = models.IntegerField(default=0)
    
    labels = models.ManyToManyField(Label, through='CardLabelRelationship')
    
    def __str__(self):
        return f"Card {self.title} ({self.id})"

class CardMembership(models.Model):
    """Represent the n-n relationship between card and member"""

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='card_members')
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='user_cards')
    updated = models.DateTimeField(auto_now=True)
    joined = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'card')

    def __str__(self):
        return f'CardMembership ({self.id})'

class CardLabelRelationship(models.Model):
    """Represent n-n relationship between card and label"""

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='label_cards')
    label = models.ForeignKey(Label, on_delete=models.CASCADE, related_name='card_labels')

    class Meta:
        unique_together = ('card', 'label')

    def __str__(self):
        return f'CardLabelRelationship ({self.id})'


class Checklist(models.Model):
    """Represent checklist in a card"""

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='checklists')
    title = models.CharField(default='Untitled', max_length=128)
    position = models.IntegerField(default=0)

    def __str__(self):
        return f'Checklist {self.title} ({self.id})'


class ChecklistItem(models.Model):
    """Represent item of a checklist"""

    checklist = models.ForeignKey(Checklist, on_delete=models.CASCADE, related_name='items')
    content = models.CharField(default='', max_length=128)
    checked = models.BooleanField(default=False)
    position = models.IntegerField(default=0)
    
    def __str__(self):
        return f'Item {self.content} ({self.id})'


class Comment(models.Model):
    """Represent comment in a card"""

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(default='')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Comment {self.content} ({self.id})'


class Attachment(models.Model):
    """Represent attachment in a card"""

    name = models.CharField(default='', max_length=128, blank=True)
    file = models.FileField(upload_to=dynamic_attachment_filepath, null=True)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='attachments')
    
    def __str__(self):
        return f'Attachment {self.card} ({self.id})'
