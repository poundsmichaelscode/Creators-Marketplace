from django.urls import path
from .views import CreateCheckoutSessionView, StripeWebhookView
urlpatterns = [
    path('checkout/session/', CreateCheckoutSessionView.as_view()),
    path('webhooks/stripe/', StripeWebhookView.as_view()),
]
