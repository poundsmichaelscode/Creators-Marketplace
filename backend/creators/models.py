from django.conf import settings
from django.db import models
import uuid

class CreatorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='creator_profile')
    display_name = models.CharField(max_length=120, db_index=True)
    bio = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    avatar_url = models.URLField(blank=True)
    banner_url = models.URLField(blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    default_currency = models.CharField(max_length=8, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name
