from django.urls import path
from .views import GenerateView, HistoryView
urlpatterns = [
    path('generate/', GenerateView.as_view()),
    path('history/', HistoryView.as_view()),
]
