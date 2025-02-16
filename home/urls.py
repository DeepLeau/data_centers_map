from django.urls import path
from .views import get_departement_data, get_departements_scores, home_view

urlpatterns = [
    path('', home_view, name='home'),
    path('departements_scores/', get_departements_scores, name='get_departements_scores'),
    path('departements-data/', get_departement_data, name="get_departement_data")
]