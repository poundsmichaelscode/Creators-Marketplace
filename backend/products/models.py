from django.db import models
from creators.models import CreatorProfile
import uuid

class Product(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    class ProductType(models.TextChoices):
        COURSE = 'course', 'Course'
        MUSIC = 'music', 'Music'
        TEMPLATE = 'template', 'Template'
        CODE = 'code', 'Code'
        EBOOK = 'ebook', 'Ebook'
        BUNDLE = 'bundle', 'Bundle'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(CreatorProfile, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(unique=True)
    short_description = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    product_type = models.CharField(max_length=20, choices=ProductType.choices, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    price_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default='USD')
    thumbnail_url = models.URLField(blank=True)
    preview_assets = models.JSONField(default=list, blank=True)
    delivery_type = models.CharField(max_length=32, default='file_download')
    file_key = models.CharField(max_length=512, blank=True)
    download_limit = models.IntegerField(default=5)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5)
    body = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
