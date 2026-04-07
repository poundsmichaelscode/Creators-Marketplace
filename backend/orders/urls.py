from django.urls import path
from .views import OrderListView, OrderDetailView
urlpatterns = [
    path('', OrderListView.as_view()),
    path('<uuid:pk>/', OrderDetailView.as_view()),
]
