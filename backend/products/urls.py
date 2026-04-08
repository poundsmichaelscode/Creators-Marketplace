from django.urls import path
from .views import ProductListCreateView, ProductDetailView, publish_product, archive_product

urlpatterns = [
    path('', ProductListCreateView.as_view()),
    path('<uuid:pk>/', ProductDetailView.as_view()),
    path('<uuid:pk>/publish/', publish_product),
    path('<uuid:pk>/archive/', archive_product),
]
