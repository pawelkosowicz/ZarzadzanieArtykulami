from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView

# klasa zwracajaca statyczny widok
class Forum(TemplateView):
    template_name = 'login.html'