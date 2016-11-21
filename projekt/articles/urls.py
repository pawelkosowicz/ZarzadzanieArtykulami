from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^contact', include('contact.urls')),
    url(r'', include('users.urls')),
    url(r'^forum', include('forum.urls')),
    url(r'^$',views.Main.as_view(), name='main'),
    url(r'^oldNews/$',views.OldNews.as_view(),name='oldNews'),
    url(r'^post/(?P<post_id>\d+)/$',views.SingleArticle.as_view(), name='post'),
]
