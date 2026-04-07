from django.db import models

class MembershipPlan(models.Model):
    name = models.CharField(max_length=80)
    price_amount = models.DecimalField(max_digits=10, decimal_places=2)
    interval = models.CharField(max_length=20, default='month')

