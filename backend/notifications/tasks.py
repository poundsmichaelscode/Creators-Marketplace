from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

@shared_task
def send_in_app_notification(user_id: str, type: str, title: str, body: str = ''):
    user = User.objects.get(id=user_id)
    notification = Notification.objects.create(user=user, type=type, title=title, body=body)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(f'notifications_{user.id}', {
        'type': 'notify',
        'payload': {'id': str(notification.id), 'title': title, 'body': body, 'type': type},
    })
