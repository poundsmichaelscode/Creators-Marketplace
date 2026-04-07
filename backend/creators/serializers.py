from rest_framework import serializers
from .models import CreatorProfile

class CreatorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatorProfile
        fields = '__all__'
        read_only_fields = ['user']
