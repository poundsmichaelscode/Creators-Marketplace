from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=120)
    owner_id = models.UUIDField()

