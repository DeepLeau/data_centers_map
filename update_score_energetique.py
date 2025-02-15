import django
import os
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'data_centers_map.settings')
django.setup()

from home.models import Departement

def update_score_energetique():
    departements = Departement.objects.all()
    
    for departement in departements:
        for annee in departement.temperatures.keys():
            departement.calculer_score_energetique(annee)
            print(departement.calculer_score_energetique(annee))
        departement.save()

update_score_energetique()
print("Score énergétique mis à jour pour tous les départements.")