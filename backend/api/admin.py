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
    list_display = ('__str__',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(CardLabelRelationship)
class CardLabelRelationshipAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(CardMembership)
class CardMembershipAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


@admin.register(BoardMembership)
class BoardMembershipAdmin(admin.ModelAdmin):
    list_display = ('__str__',)

@admin.register(WorkspaceMembership)
class WorkspaceMembershipAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
