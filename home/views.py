from django.http import JsonResponse
from django.shortcuts import render

from home.models import Departement

def home_view(request):
    return render(request, "home.html")

def get_departements_scores(request):
    """
    Retourne un JSON contenant le total_score de chaque département.
    """
    departements = Departement.objects.all()
    data = {
        dep.nom: dep.total_score for dep in departements
    }
    return JsonResponse(data)