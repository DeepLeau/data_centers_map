from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("dashboard")  
        else:
            messages.error(request, "Identifiants invalides")
    
    return render(request, "login.html")

def logout_view(request):
    logout(request)
    return redirect("login")  

def register_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            messages.error(request, "Passwords are not the same.")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "This username is already taken.")
        elif User.objects.filter(email=email).exists():
            messages.error(request, "This email is already used.")
        else:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            login(request, user)  
            return redirect("home")  

    return render(request, "register.html")