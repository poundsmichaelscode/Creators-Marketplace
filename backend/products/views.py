from django.utils import timezone
from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from common.permissions import IsCreator
from creators.models import CreatorProfile
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'description']
    ordering_fields = ['created_at', 'price_amount', 'published_at']

    def get_queryset(self):
        qs = Product.objects.select_related('creator').all()
        if self.request.user.is_authenticated and self.request.user.role == 'creator':
            return qs.filter(creator__user=self.request.user)
        return qs.filter(status='published')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsCreator()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        profile, _ = CreatorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'display_name': self.request.user.username or self.request.user.email.split('@')[0], 'slug': str(self.request.user.id)[:8]}
        )
        serializer.save(creator=profile)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('creator')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsCreator()]

    def get_queryset(self):
        qs = Product.objects.select_related('creator')
        if self.request.method in permissions.SAFE_METHODS:
            return qs.filter(status='published')
        return qs.filter(creator__user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsCreator])
def publish_product(request, pk):
    product = Product.objects.get(pk=pk, creator__user=request.user)
    product.status = 'published'
    product.published_at = timezone.now()
    product.save(update_fields=['status', 'published_at', 'updated_at'])
    return Response(ProductSerializer(product).data)
