from django.db import models
from creators.models import CreatorProfile
from products.models import Product
import uuid

class AIGeneration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(CreatorProfile, on_delete=models.CASCADE, related_name='ai_generations')
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    generation_type = models.CharField(max_length=32)
    prompt = models.TextField()
    result_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='queued')
    created_at = models.DateTimeField(auto_now_add=True)
