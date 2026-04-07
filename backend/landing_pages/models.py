from django.db import models
from creators.models import CreatorProfile
from products.models import Product
import uuid

class LandingPage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(CreatorProfile, on_delete=models.CASCADE, related_name='landing_pages')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='landing_pages')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    status = models.CharField(max_length=20, default='draft', db_index=True)
    theme = models.JSONField(default=dict, blank=True)
    schema = models.JSONField(default=dict, blank=True)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
