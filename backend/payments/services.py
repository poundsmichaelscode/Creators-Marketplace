import stripe
from django.conf import settings
from products.models import Product
from orders.models import Order, OrderItem, DownloadEntitlement
from .models import Payment, WebhookEvent

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(*, user, product_id):
    product = Product.objects.select_related('creator').get(id=product_id, status='published')
    order = Order.objects.create(
        buyer=user,
        subtotal_amount=product.price_amount,
        total_amount=product.price_amount,
        currency=product.currency,
    )
    item = OrderItem.objects.create(order=order, product=product, unit_price_amount=product.price_amount, quantity=1)
    payment = Payment.objects.create(order=order, amount=product.price_amount, currency=product.currency)
    if settings.STRIPE_SECRET_KEY:
        session = stripe.checkout.Session.create(
            mode='payment',
            line_items=[{
                'price_data': {
                    'currency': product.currency.lower(),
                    'unit_amount': int(float(product.price_amount) * 100),
                    'product_data': {'name': product.title},
                },
                'quantity': 1,
            }],
            success_url=f"{settings.FRONTEND_URL}/checkout/success?orderId={order.id}",
            cancel_url=f"{settings.FRONTEND_URL}/products/{product.slug}",
            metadata={'order_id': str(order.id), 'payment_id': str(payment.id)},
        )
        payment.provider_payment_id = session.id
        payment.save(update_fields=['provider_payment_id'])
        return {'url': session.url, 'order_id': order.id}
    return {'url': f"{settings.FRONTEND_URL}/checkout/success?orderId={order.id}", 'order_id': order.id}


def fulfill_order(order):
    order.status = 'paid'
    order.save(update_fields=['status', 'updated_at'])
    for item in order.items.select_related('product').all():
        DownloadEntitlement.objects.get_or_create(order_item=item, defaults={'remaining_downloads': item.product.download_limit})
