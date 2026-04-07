from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/creators/', include('creators.urls')),
    path('api/v1/products/', include('products.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/payments/', include('payments.urls')),
    path('api/v1/landing-pages/', include('landing_pages.urls')),
    path('api/v1/analytics/', include('analytics_app.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
    path('api/v1/ai/', include('ai_tools.urls')),
    path('api/v1/features/', include('feature_flags.urls')),
]
