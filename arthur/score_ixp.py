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

# Charger les fichiers JSON
with open('pos_ixp.json', 'r', encoding='utf-8') as file1, open('pos_pref.json', 'r', encoding='utf-8') as file2:
    data_ixp = json.load(file1)
    data_pref = json.load(file2)

# Liste pour stocker les résultats
resultats = []

#parcour dept
for dept in data_pref.get("departements", []):
    lat1, long1= dept['latitude'], dept['longitude'] #coodonnées pref
    distances = []
    for coord in data_ixp.get("coordinates", []):
        lat2, long2 = coord['latitude'], coord['longitude'] #coordonnées ixp
        distances.append(haversine_distance(lat1, long1, lat2, long2))

    # Ajouter le résultat à la liste
    if distances:
        min_distance = min(distances)
        resultats.append({
            'nom': dept['nom'],
            'distance': min_distance
        })
    else:
        resultats.append({
            'nom': dept['nom'],
            'distance': None
        })

# Sauvegarder les résultats dans un fichier JSON
with open('distances_departements.json', 'w', encoding='utf-8') as output_file:
    json.dump(resultats, output_file, ensure_ascii=False, indent=4)

print("Les distances ont été sauvegardées dans 'distances_departements.json'.")


