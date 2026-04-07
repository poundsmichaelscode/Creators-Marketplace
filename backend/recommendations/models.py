from django.db import models

class RecommendationSnapshot(models.Model):
    entity_type = models.CharField(max_length=40)
    entity_id = models.CharField(max_length=80)
    payload = models.JSONField(default=dict)

