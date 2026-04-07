from rest_framework import serializers
from .models import Product, ProductReview

class ProductSerializer(serializers.ModelSerializer):
    creator_slug = serializers.CharField(source='creator.slug', read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['creator', 'published_at']

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'
