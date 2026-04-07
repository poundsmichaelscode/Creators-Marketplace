from rest_framework import generics, permissions
from .models import CreatorProfile
from .serializers import CreatorProfileSerializer

class MyCreatorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = CreatorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'display_name': self.request.user.username or self.request.user.email.split('@')[0], 'slug': str(self.request.user.id)[:8]}
        )
        return profile

class CreatorProfileDetailView(generics.RetrieveAPIView):
    queryset = CreatorProfile.objects.all()
    serializer_class = CreatorProfileSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]
