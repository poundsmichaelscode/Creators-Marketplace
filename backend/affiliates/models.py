from django.db import models

class AffiliateProgram(models.Model):
    code = models.CharField(max_length=40, unique=True)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10)

