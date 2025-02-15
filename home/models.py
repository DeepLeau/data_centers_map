from home.utils import ThermalEfficiency_score
from django.db import models
import json

class Departement(models.Model):   
    nom = models.CharField(max_length=100, unique=True)
    temperatures = models.JSONField()
    score_energetique = models.JSONField(default=dict)
    score_elec = models.FloatField(default=0)
    score_ixp = models.FloatField(default=0)
    total_score = models.FloatField(default=0)

    def get_temperature_max(self, annee, mois):
        """
        Retourne la température maximale pour une année et un mois donnés.
        """
        return self.temperatures.get(str(annee), {}).get(str(mois), None)

    def ecart_temperature(self, annee1, annee2, mois):
        """
        Calcule l'écart de température entre deux années pour un mois donné.
        """
        temp1 = self.get_temperature_max(annee1, mois)
        temp2 = self.get_temperature_max(annee2, mois)
        
        if temp1 is not None and temp2 is not None:
            return round(temp2 - temp1, 2)  
        else:
            return None  

    def calculer_score_energetique(self, annee):
        """
        Calcule le score énergétique pour chaque mois de l'année donnée en fonction des températures maximales.
        Stocke les résultats dans l'attribut `score_energetique`.
        """
        if annee not in self.temperatures:
            print(f"Pas de données disponibles pour l'année {annee} dans {self.nom}.")
            return None

        self.score_energetique[annee] = {}
        months_list = {
            1: "Janvier", 2: "Février", 3: "Mars", 4: "Avril", 5: "Mai", 6: "Juin",
            7: "Juillet", 8: "Août", 9: "Septembre", 10: "Octobre", 11: "Novembre", 12: "Décembre"
        }

        for mois in range(1, 13):  
            temp_max = self.get_temperature_max(annee, months_list[mois])
            if temp_max is not None:
                self.score_energetique[annee][mois] = ThermalEfficiency_score(temp_max)
            else:
                self.score_energetique[annee][mois] = None  

        return self.score_energetique[annee]
    
    def extract_score_ixp(self):
        with open("arthur/ixp_score.json", "r", encoding="utf-8") as fichier:
            data = json.load(fichier)

            for departement_data in data:
                if departement_data['nom'] == self.nom:
                    self.score_ixp = departement_data['score']
                    print("score:", self.score_ixp)
                    return self.score_ixp

            print(f"Score not found for departement {self.nom}")
            return None
        
    def get_total_score(self, annee="2100"):
        """
        Calcule le score total en prenant la moyenne des trois scores :
        - score_elec
        - max des valeurs de score_energetique[annee]
        - score_ixp
        """
        score_energetique_max = max(self.score_energetique.get(annee, {}).values(), default=0)

        self.total_score = round((self.score_elec + score_energetique_max + self.score_ixp) / 3, 2)
        return self.total_score
