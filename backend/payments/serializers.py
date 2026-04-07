from rest_framework import serializers

class CreateCheckoutSessionSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    buyer_email = serializers.EmailField(required=False)
