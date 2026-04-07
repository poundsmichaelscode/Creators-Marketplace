from django.urls import path
from .views import LandingPageListCreateView, LandingPageDetailView, PublicLandingPageView
urlpatterns = [
    path('', LandingPageListCreateView.as_view()),
    path('<uuid:pk>/', LandingPageDetailView.as_view()),
    path('public/<slug:slug>/', PublicLandingPageView.as_view()),
]
