from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import View

# klasa wyswieltajaca panel logowania w przypadku zapytania get
# zapytanie post pobiera dane uzytkowika z przegladarki oraz loguje go do systemu
class LoginView(View):
    def post(self, request):
        username = request.POST['email']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/mvc-application/')
            else:
                return HttpResponse("Your account is disabled.")
        else:
            print("Invalid login details: {0}, {1}".format(username, password))
            return HttpResponseRedirect('/mvc-application/login/')

    def get(self, request):
        return render(request, 'login.html', {})

#wylogowywanie uzytkownika
class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect('/mvc-application/')

