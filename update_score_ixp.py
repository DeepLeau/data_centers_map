import django
import os
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'data_centers_map.settings')
django.setup()

from home.models import Departement

def update_score_ixp():
    departements = Departement.objects.all()
    
    for departement in departements:
        departement.extract_score_ixp()
        print(departement.extract_score_ixp())
        departement.save()

update_score_ixp()
print("Score ixp mis à jour pour tous les départements.")