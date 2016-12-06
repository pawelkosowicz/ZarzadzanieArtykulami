from django.conf.urls import  url
from . import views

urlpatterns = [
    url(r'^post/(?P<post_id>\d+)/$', views.SingleArticle.as_view(), name='post'),
    url(r'^getPost/$', views.GetSingleArticle.as_view(), name='getPost'),
    url(r'^updatePost/$', views.UpdateSingleArticle.as_view(), name='updatePost'),
    url(r'^addComment/$', views.AddComments.as_view(), name='addComment'),
    url(r'^getComments/$', views.GetComments.as_view(), name='getComments'),
    url(r'^upvoteComment/$', views.UpvoteComment.as_view(), name='upvoteComment'),
    url(r'^deleteComment/$', views.DeleteComment.as_view(), name='deleteComment'),
    url(r'^editComment/$', views.EditComment.as_view(), name='editComment'),
]
