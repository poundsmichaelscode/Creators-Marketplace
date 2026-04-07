from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'unit_price_amount', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'status', 'currency', 'subtotal_amount', 'total_amount', 'created_at', 'items']
