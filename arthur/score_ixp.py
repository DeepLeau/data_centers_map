import json
import math

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Rayon de la Terre en km
    
    # Conversion des degrés en radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Différences des coordonnées
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    # Formule de Haversine
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c  # Distance en kilomètres

def calculer_score(distance, distance_max):
    # Calcul du score sur une échelle de 0 à 100
    # La distance maximale de l'IXP (en km) pourrait être définie comme la distance la plus éloignée
    return max(0, 100 - (distance / distance_max) * 100)

# Charger les fichiers JSON
with open('pos_ixp.json', 'r', encoding='utf-8') as file1, open('pos_pref.json', 'r', encoding='utf-8') as file2:
    data_ixp = json.load(file1)
    data_pref = json.load(file2)

# Liste pour stocker les résultats
resultats = []

# Trouver la distance maximale (distance maximale entre le département et les coordonnées IXP)
distances_max = []
for dept in data_pref.get("departements", []):
    lat1, long1 = dept['latitude'], dept['longitude']  # Coordonnées du département
    for coord in data_ixp.get("coordinates", []):
        lat2, long2 = coord['latitude'], coord['longitude']  # Coordonnées IXP
        distance = haversine_distance(lat1, long1, lat2, long2)
        distances_max.append(distance)

# Trouver la distance maximale
distance_max = max(distances_max)

# Parcourir les départements
for dept in data_pref.get("departements", []):
    lat1, long1 = dept['latitude'], dept['longitude']  # Coordonnées du département
    distances = []
    
    # Calculer les distances pour chaque coordonnée IXP
    for coord in data_ixp.get("coordinates", []):
        lat2, long2 = coord['latitude'], coord['longitude']  # Coordonnées IXP
        distances.append(haversine_distance(lat1, long1, lat2, long2))
    
    # Calculer le score en fonction de la distance minimale
    if distances:
        min_distance = min(distances)
        score = calculer_score(min_distance, distance_max)
        resultats.append({
            'nom': dept['nom'],
            'distance': min_distance,
            'score': score
        })
    else:
        resultats.append({
            'nom': dept['nom'],
            'distance': None,
            'score': None
        })

# Sauvegarder les résultats dans un fichier JSON
with open('distances_scores_departements.json', 'w', encoding='utf-8') as output_file:
    json.dump(resultats, output_file, ensure_ascii=False, indent=4)

print("Les distances et scores ont été sauvegardés dans 'distances_scores_departements.json'.")
