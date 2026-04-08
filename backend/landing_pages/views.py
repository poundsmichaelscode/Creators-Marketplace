from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from creators.models import CreatorProfile
from .models import LandingPage
from .serializers import LandingPageSerializer

class LandingPageListCreateView(generics.ListCreateAPIView):
    serializer_class = LandingPageSerializer
    pagination_class = None
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LandingPage.objects.filter(creator__user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        profile, _ = CreatorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'display_name': self.request.user.username or self.request.user.email.split('@')[0], 'slug': str(self.request.user.id)[:8]}
        )
        serializer.save(creator=profile)

class LandingPageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LandingPageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LandingPage.objects.filter(creator__user=self.request.user)

class PublicLandingPageView(generics.RetrieveAPIView):
    queryset = LandingPage.objects.filter(status='published')
    serializer_class = LandingPageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_landing_page(request, pk):
    page = LandingPage.objects.get(pk=pk, creator__user=request.user)
    page.status = 'published'
    page.published_at = timezone.now()
    page.save(update_fields=['status', 'published_at', 'updated_at'])
    return Response(LandingPageSerializer(page).data)
