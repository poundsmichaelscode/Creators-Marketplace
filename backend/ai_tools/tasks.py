from celery import shared_task
from .models import AIGeneration

@shared_task
def run_ai_generation(generation_id: str):
    generation = AIGeneration.objects.get(id=generation_id)
    generation.status = 'completed'
    generation.result_text = f"Generated {generation.generation_type} copy based on prompt: {generation.prompt[:500]}"
    generation.save(update_fields=['status', 'result_text'])
