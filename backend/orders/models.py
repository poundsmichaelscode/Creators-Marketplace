from django.conf import settings
from django.db import models
from products.models import Product
import uuid

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    currency = models.CharField(max_length=8, default='USD')
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    unit_price_amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    license_snapshot = models.JSONField(default=dict, blank=True)

class DownloadEntitlement(models.Model):
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='entitlement')
    remaining_downloads = models.PositiveIntegerField(default=5)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
