from django.urls import path
from .views import get_departements_scores, home_view

urlpatterns = [
    path('', home_view, name='home'),
    path('departements_scores/', get_departements_scores, name='get_departements_scores'),
]