# -*- coding: utf-8 -*-

import smtplib

from django.core.serializers import json
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import TemplateView, View
import json

from projekt import settings

# klasa zwracajaca statyczny widok
class Contact(TemplateView):
    template_name = 'contact.html'


class SendEmail(View):
    def post(self, request):
        data = json.loads(request.body)
        try:
            self.sendEmail(data)
            return JsonResponse({'response':'OK'})
        except:
            return JsonResponse({'response':'FAIL'})


    def sendEmail(self, data):
        msg = "\r\n".join([
            "From:" + settings.EMAIL_HOST_USER,
            "To:" + settings.EMAIL_HOST_PASSWORD,
            "Subject:" + data['name'],
            "",
            data['email'] + ' ' + data['phone'] + ': ' + data['message']
        ])

        username = settings.EMAIL_HOST_USER
        password = settings.EMAIL_HOST_PASSWORD
        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.login(username, password)
        server.sendmail(username, username, msg)
        server.quit()
