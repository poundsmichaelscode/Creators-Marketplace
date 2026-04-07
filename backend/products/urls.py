from django.urls import path
from .views import ProductListCreateView, ProductDetailView, publish_product
urlpatterns = [
    path('', ProductListCreateView.as_view()),
    path('<uuid:pk>/', ProductDetailView.as_view()),
    path('<uuid:pk>/publish/', publish_product),
]
