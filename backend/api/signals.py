from django.db.models.signals import post_save, post_delete
from django.contrib.auth import get_user_model
from django.dispatch import receiver

from api.models import *

@receiver(post_save, sender=get_user_model())
def create_personal_workspace(sender, instance, created, **kwargs):
    if created:
        workspace = Workspace.objects.create(
            name=f"{instance.get_full_name()}'s workspace",
            visibility=Workspace.VISIBILITY.PRIVATE
        )

        WorkspaceMembership.objects.create(
            user=instance,
            workspace=workspace,
            role=WorkspaceMembership.ROLE.ADMIN
        )
