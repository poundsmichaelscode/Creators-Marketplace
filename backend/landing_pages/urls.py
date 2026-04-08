from django.urls import path
from .views import LandingPageListCreateView, LandingPageDetailView, PublicLandingPageView, publish_landing_page

urlpatterns = [
    path('', LandingPageListCreateView.as_view()),
    path('<uuid:pk>/', LandingPageDetailView.as_view()),
    path('<uuid:pk>/publish/', publish_landing_page),
    path('public/<slug:slug>/', PublicLandingPageView.as_view()),
]
