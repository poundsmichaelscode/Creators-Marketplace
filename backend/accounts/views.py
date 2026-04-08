import os
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, response, views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, MeSerializer, LoginSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveAPIView):
    serializer_class = MeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return response.Response({'detail': 'Logged out client-side. Discard JWT tokens.'})

class SocialProvidersView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        providers = [
            {'name': 'google', 'label': 'Google', 'url': os.getenv('GOOGLE_AUTH_URL', '').strip()},
            {'name': 'facebook', 'label': 'Facebook', 'url': os.getenv('FACEBOOK_AUTH_URL', '').strip()},
            {'name': 'github', 'label': 'GitHub', 'url': os.getenv('GITHUB_AUTH_URL', '').strip()},
            {'name': 'linkedin', 'label': 'LinkedIn', 'url': os.getenv('LINKEDIN_AUTH_URL', '').strip()},
            {'name': 'x', 'label': 'X', 'url': os.getenv('X_AUTH_URL', '').strip()},
        ]
        return response.Response([dict(item, enabled=bool(item['url'])) for item in providers])
