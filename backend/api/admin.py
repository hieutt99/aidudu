from django.contrib import admin
from api.models import *

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name')

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')

@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'name')
