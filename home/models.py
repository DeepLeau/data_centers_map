from home.utils import ThermalEfficiency_score
from django.db import models

class Departement(models.Model):   
    nom = models.CharField(max_length=100, unique=True)
    temperatures = models.JSONField()
    score_energetique = models.JSONField(default=dict)
    
    def get_temperature_max(self, annee, mois):
        """
        Retourne la température maximale pour une année et un mois donnés.
        """
        return self.temperatures.get(annee, {}).get(mois, None)

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

        for mois in range(1, 13):  
            temp_max = self.obtenir_temperature_max(annee, mois)
            if temp_max is not None:
                self.score_energetique[annee][mois] = ThermalEfficiency_score(temp_max)
            else:
                self.score_energetique[annee][mois] = None  

        return self.score_energetique[annee]