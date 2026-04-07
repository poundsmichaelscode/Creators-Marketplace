from django.urls import path
from .views import AnalyticsEventCreateView, DashboardSummaryView
urlpatterns = [
    path('events/', AnalyticsEventCreateView.as_view()),
    path('summary/', DashboardSummaryView.as_view()),
]
