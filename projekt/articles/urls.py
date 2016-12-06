from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^contact', include('contact.urls')),
    url(r'', include('users.urls')),
    url(r'', include('post.urls')),
    url(r'^forum', include('forum.urls')),
    url(r'^$',views.Main.as_view(), name='main'),
    url(r'^oldNews/$',views.OldNews.as_view(),name='oldNews'),
    url(r'^deleteNews/$',views.DeleteNews.as_view(), name='deleteNews'),
    url(r'^getNews/$',views.Articles.as_view(), name='getNews'),
    url(r'^editNews/$', views.EditNews.as_view(), name='editNews'),
    url(r'^addNews/$', views.AddNews.as_view(), name='addNews'),
]