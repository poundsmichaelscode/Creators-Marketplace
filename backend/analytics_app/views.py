from django.db.models import Count, Sum
from rest_framework import generics, permissions, views, response
from creators.models import CreatorProfile
from orders.models import OrderItem
from .models import AnalyticsEvent
from .serializers import AnalyticsEventSerializer

class AnalyticsEventCreateView(generics.CreateAPIView):
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.AllowAny]

class DashboardSummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        if request.user.role == 'creator':
            profile = CreatorProfile.objects.filter(user=request.user).first()
            sales = OrderItem.objects.filter(product__creator=profile, order__status='paid').aggregate(total=Sum('unit_price_amount'))
            top_products = OrderItem.objects.filter(product__creator=profile, order__status='paid').values('product__title').annotate(count=Count('id')).order_by('-count')[:5]
            return response.Response({
                'revenue': sales['total'] or 0,
                'top_products': list(top_products),
            })
        return response.Response({'detail': 'No summary available for this role'})
