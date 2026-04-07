from rest_framework import generics, permissions
from creators.models import CreatorProfile
from .models import LandingPage
from .serializers import LandingPageSerializer

class LandingPageListCreateView(generics.ListCreateAPIView):
    serializer_class = LandingPageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LandingPage.objects.filter(creator__user=self.request.user)

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
