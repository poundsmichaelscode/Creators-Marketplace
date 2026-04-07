from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, MeSerializer, LoginSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

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
