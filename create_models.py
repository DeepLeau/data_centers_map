import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "data_centers_map.settings")  
django.setup()

import json
from home.models import Departement 

with open("predictions_temperatures.json", "r", encoding="utf-8") as fichier:
    data = json.load(fichier)

departements_instances = []

for nom, temperatures in data.items():
    departements_instances.append(Departement(nom=nom, temperatures=temperatures))

Departement.objects.bulk_create(departements_instances)

for dep in Departement.objects.all()[:5]:  
    print(dep)