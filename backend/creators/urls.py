from django.urls import path
from .views import MyCreatorProfileView, CreatorProfileDetailView
urlpatterns = [
    path('me/', MyCreatorProfileView.as_view()),
    path('<slug:slug>/', CreatorProfileDetailView.as_view()),
]
