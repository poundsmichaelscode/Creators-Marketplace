from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    class Roles(models.TextChoices):
        BUYER = 'buyer', 'Buyer'
        CREATOR = 'creator', 'Creator'
        ADMIN = 'admin', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.BUYER, db_index=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
