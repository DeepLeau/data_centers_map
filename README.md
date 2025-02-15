# Django Project

Ce projet est une application Django qui inclut un système d'authentification et une interface HTML/JS.

## 📌 Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

- Python (≥ 3.8)
- pip (gestionnaire de paquets Python)
- PostgreSQL (optionnel, si vous souhaitez utiliser une base de données autre que SQLite)
- Un environnement virtuel (recommandé)

---

## 🚀 Installation

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/ton-utilisateur/ton-repo.git
   cd ton-repo
   ```

2. **Créez un environnement virtuel et activez-le** :
   ```bash
   python -m venv venv
   source venv/bin/activate  # (Sous Windows : venv\Scripts\activate)
   ```

3. **Installez les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

4. **Appliquez les migrations** :
   ```bash
   python manage.py migrate
   ```

5. **Créez un superutilisateur (facultatif, pour l'administration)** :
   ```bash
   python manage.py createsuperuser
   ```

6. **Lancez le serveur Django** :
   ```bash
   python manage.py runserver
   ```

L'application sera accessible sur `http://127.0.0.1:8000/`.

---

## 📌 Structure du Projet

```
/ton-repo
│── backend/            # Projet Django principal
│── login/              # Application pour l'authentification
│── home/               # Page d'accueil publique
│── dashboard/          # Interface utilisateur après connexion
│── static/             # Fichiers statiques (CSS, JS, images)
│── templates/          # Templates HTML
│── requirements.txt    # Dépendances du projet
│── manage.py           # Commandes Django
```

---

## 📌 Comment Écrire en HTML/JS avec Django ?

### 1️⃣ Créer un Template HTML

Les fichiers HTML se trouvent dans `templates/`. Un exemple de fichier `home.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>
<body>
    <h2>Welcome !</h2>
    <p>Please connect yourself.</p>
    <a href="{% url 'login' %}">Login</a>
    <a href="{% url 'register' %}">Create an account</a>
</body>
</html>
```

### 2️⃣ Ajouter un Fichier JavaScript

Place ton JavaScript dans `static/js/script.js` dans l'application concerné:

```js
function showMessage() {
    alert("Bonjour depuis Django !");
}
```
---

## 📌 Liens Utiles

- Documentation Django : [https://docs.djangoproject.com/fr/](https://docs.djangoproject.com/fr/)
- Django Template Language (DTL) : [https://docs.djangoproject.com/en/4.2/ref/templates/](https://docs.djangoproject.com/en/4.2/ref/templates/)

---
