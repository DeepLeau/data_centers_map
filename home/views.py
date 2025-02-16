from django.http import JsonResponse
from django.shortcuts import render

from home.models import Departement
from home.utils import get_criteria_scores

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

def criteria_scores_view(request):
    """
    Retourne un JSON contenant la pondération de chaque critère.
    """
    scores = get_criteria_scores(request)

    data = {
        'energy': scores[0],
        'network_proximity': scores[1],
        'environment': scores[2]
    }

    return JsonResponse(data)