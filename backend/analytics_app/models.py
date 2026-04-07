from django.conf import settings
from django.db import models
from creators.models import CreatorProfile
from products.models import Product
from landing_pages.models import LandingPage

class AnalyticsEvent(models.Model):
    event_name = models.CharField(max_length=120, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    creator = models.ForeignKey(CreatorProfile, null=True, blank=True, on_delete=models.SET_NULL)
    landing_page = models.ForeignKey(LandingPage, null=True, blank=True, on_delete=models.SET_NULL)
    session_id = models.CharField(max_length=120, db_index=True)
    occurred_at = models.DateTimeField(auto_now_add=True, db_index=True)
    properties = models.JSONField(default=dict, blank=True)
