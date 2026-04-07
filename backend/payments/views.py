import stripe
from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import permissions, response, views
from .serializers import CreateCheckoutSessionSerializer
from .services import create_checkout_session, fulfill_order
from .models import WebhookEvent
from orders.models import Order
from notifications.tasks import send_in_app_notification

class CreateCheckoutSessionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        serializer = CreateCheckoutSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = create_checkout_session(user=request.user, product_id=serializer.validated_data['product_id'])
        return response.Response(data)

class StripeWebhookView(views.APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        event = None
        try:
            if settings.STRIPE_WEBHOOK_SECRET:
                event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
            else:
                event = request.data
        except Exception:
            return HttpResponse(status=400)

        event_id = event.get('id', timezone.now().isoformat())
        event_type = event.get('type', 'unknown')
        webhook, created = WebhookEvent.objects.get_or_create(event_id=event_id, defaults={'event_type': event_type, 'payload': event})
        if not created and webhook.status == 'processed':
            return HttpResponse(status=200)

        if event_type == 'checkout.session.completed':
            data = event['data']['object']
            order_id = data['metadata']['order_id']
            order = Order.objects.prefetch_related('items__product').get(id=order_id)
            fulfill_order(order)
            send_in_app_notification.delay(str(order.buyer_id), 'order_paid', 'Order paid', f'Your order {order.id} was successfully paid.')

        webhook.status = 'processed'
        webhook.processed_at = timezone.now()
        webhook.attempt_count += 1
        webhook.save(update_fields=['status', 'processed_at', 'attempt_count'])
        return HttpResponse(status=200)
