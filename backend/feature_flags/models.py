from django.db import models

class FeatureFlag(models.Model):
    key = models.CharField(max_length=100, unique=True)
    enabled = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    conditions = models.JSONField(default=dict, blank=True)

