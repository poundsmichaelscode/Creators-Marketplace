from rest_framework import generics, permissions, response, views
from creators.models import CreatorProfile
from .models import AIGeneration
from .serializers import GenerateSerializer, AIGenerationSerializer
from .tasks import run_ai_generation

class GenerateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        serializer = GenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile, _ = CreatorProfile.objects.get_or_create(
            user=request.user,
            defaults={'display_name': request.user.username or request.user.email.split('@')[0], 'slug': str(request.user.id)[:8]}
        )
        generation = AIGeneration.objects.create(
            creator=profile,
            generation_type=serializer.validated_data['generation_type'],
            prompt=serializer.validated_data['prompt'],
        )
        run_ai_generation.delay(str(generation.id))
        return response.Response(AIGenerationSerializer(generation).data, status=202)

class HistoryView(generics.ListAPIView):
    serializer_class = AIGenerationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return AIGeneration.objects.filter(creator__user=self.request.user).order_by('-created_at')
