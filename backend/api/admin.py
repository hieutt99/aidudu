from django.contrib import admin
from api.models import *

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name')

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('__str__',)

@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
