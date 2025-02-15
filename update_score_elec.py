import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "data_centers_map.settings")  
django.setup()

import json
from home.models import Departement 

with open("arthur/elec_score.json", "r", encoding="utf-8") as fichier:  
    data = json.load(fichier)

for nom, details in data.items():
    try:
        departement = Departement.objects.get(nom=nom)
        departement.score_elec = details["score"]
        departement.save()
        print(f"Score mis à jour pour {nom} : {details['score']}")
    except Departement.DoesNotExist:
        print(f"Département {nom} introuvable en base de données.")

print("Mise à jour terminée !")