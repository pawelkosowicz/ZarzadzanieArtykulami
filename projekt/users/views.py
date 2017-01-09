# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.mail import send_mail
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth.models import User
import smtplib

from projekt import settings


# klasa wyswieltajaca panel logowania w przypadku zapytania get
# zapytanie post pobiera dane uzytkowika z przegladarki oraz loguje go do systemu

class LoginView(View):

    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                # wylogowanie po 15min w przypadku braku aktywnosci
                request.session.set_expiry(900)
                login(request, user)
                return HttpResponseRedirect('/mvc-application/')
            else:
                return HttpResponse("Your account is disabled.")
        else:
            print("Invalid login details: {0}, {1}".format(username, password))
            return HttpResponseRedirect('/mvc-application/login/')

    def get(self, request):
        if request.user.is_authenticated():
            return HttpResponseRedirect('/mvc-application/')
        return render(request, 'login.html', {})


class RegisterView(View):
    def post(self,request):
        email = request.POST['email']
        username= request.POST['username']
        password = request.POST['password']

        # get_user_model() zwraca model User wykorzystywany w projekcie, inny niz domyslny
        user = get_user_model()

        try:
            user.objects.get(username=username)
        except user.DoesNotExist:
            user = User.objects.create_user(username, email, password)
            user.save()
            self.sendEmail(email, username)
            return JsonResponse({'response': 'OK'})

        return JsonResponse({'response':'FAIL'})

    def sendEmail(self,email,username):

        msg = "\r\n".join([
            "From: jkowalskitest88@gmail.com",
            "To:"+email,
            "Subject: Rejestracja zakonczona pomyslnie!",
            "",
            "Twoje konto o loginie "+username+" zostalo stworzone!"
        ])

        username = settings.EMAIL_HOST_USER
        password = settings.EMAIL_HOST_PASSWORD
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login(username, password)
        server.sendmail(username, email, msg)
        server.quit()


    def get(self,request):
        if request.user.is_authenticated():
            return HttpResponseRedirect('/mvc-application/')
        return render(request,'register.html',{})

#wylogowywanie uzytkownika
class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect('/mvc-application/')

