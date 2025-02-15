import json

# Charger les fichiers JSON
with open('distances_scores_departements.json', 'r', encoding='utf-8') as file1, open('elec_score.json', 'r', encoding='utf-8') as file2:
    ixp = json.load(file1)  # Fichier avec les départements et leurs capitales
    elec = json.load(file2)  # Fichier avec les départements et leurs distances et scores

# Dictionnaire pour stocker les scores
scores = {}

# Combiner les données des deux fichiers
for dept in elec:
    nom = dept['nom']
    if nom in ixp:
        # Ajouter les scores du premier fichier avec ceux du deuxième fichier
        scores[nom] = {
            'capital': ixp[nom]['capital'],
            'score1': ixp[nom]['score'],
            'score2': dept['score']
        }

# Sauvegarder les résultats dans un fichier Python
with open('scores_combines.py', 'w', encoding='utf-8') as output_file:
    output_file.write("scores = ")
    json.dump(scores, output_file, ensure_ascii=False, indent=4)

# Afficher les scores dans la console
for nom, info in scores.items():
    print(f"{nom} - Capital: {info['capital']} - Score1: {info['score1']:.2f} - Score2: {info['score2']:.2f}")
