from django.db import models
from orders.models import Order
from creators.models import CreatorProfile
import uuid

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    provider = models.CharField(max_length=20, default='stripe')
    provider_payment_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    status = models.CharField(max_length=30, default='requires_payment', db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8)
    raw_payload = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Payout(models.Model):
    creator = models.ForeignKey(CreatorProfile, on_delete=models.CASCADE, related_name='payouts')
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default='USD')
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class WebhookEvent(models.Model):
    provider = models.CharField(max_length=20, default='stripe')
    event_id = models.CharField(max_length=255, unique=True)
    event_type = models.CharField(max_length=255, db_index=True)
    payload = models.JSONField(default=dict)
    status = models.CharField(max_length=20, default='received', db_index=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    attempt_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
