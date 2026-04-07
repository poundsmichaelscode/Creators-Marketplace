from rest_framework import serializers
from .models import AIGeneration

class GenerateSerializer(serializers.Serializer):
    generation_type = serializers.ChoiceField(choices=['description', 'captions', 'email', 'seo'])
    prompt = serializers.CharField()
    product_id = serializers.UUIDField(required=False)

class AIGenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIGeneration
        fields = '__all__'
