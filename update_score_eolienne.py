import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'data_centers_map.settings')
django.setup()

from home.models import Departement
import json

def update_departement_scores(json_file):
    with open(json_file, 'r', encoding="utf-8") as file:
        data = json.load(file)

    values = list(data.values())
    min_value = min(values)
    max_value = max(values)

    for dept_name, power in data.items():
        normalized_score = ((power - min_value) / (max_value - min_value)) * 100
        departement = Departement.objects.get(nom=dept_name)
        departement.score_eolienne = normalized_score
        departement.save()

json_file_path = 'parc.json'
update_departement_scores(json_file_path)
