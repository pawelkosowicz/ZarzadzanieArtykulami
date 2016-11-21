from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^/$', views.Contact.as_view(), name='contact'),
    url(r'^/sendEmail/$', views.SendEmail.as_view(), name='sendEmail'),
]
