from django.conf import settings
from django.db import models

class AuditLog(models.Model):
    actor_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    entity_type = models.CharField(max_length=80, db_index=True)
    entity_id = models.CharField(max_length=80, db_index=True)
    action = models.CharField(max_length=80, db_index=True)
    before_data = models.JSONField(default=dict, blank=True)
    after_data = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
