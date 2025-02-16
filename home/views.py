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
        dep.nom: dep.get_total_score() for dep in departements
    }
    return JsonResponse(data)

def get_departement_data(request):
    data = list(Departement.objects.values(
        'nom', 'score_eolienne', 'score_energetique', 'score_elec', 'score_ixp'
    ))
    return JsonResponse(data, safe=False)