from django.shortcuts import render
from django.views.generic import TemplateView

# klasa zwracajaca statyczny widok
class Contact(TemplateView):
    template_name = 'contact.html'
