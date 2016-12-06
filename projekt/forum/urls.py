from django.conf.urls import  url
from . import views

urlpatterns = [
    url(r'^/$', views.Forum.as_view(), name='forum'),
    url(r'^/topic/(?P<topic_id>\d+)/$',views.ForumTopicComments.as_view(), name='topic'),
    url(r'^/addComment/$',views.ForumAddComment.as_view(), name='addComment'),
    url(r'^/getComments/$',views.ForumGetComments.as_view(), name='getComments'),
    url(r'^/deleteTopic/$',views.ForumDeleteTopic.as_view(), name='deleteTopic'),
    url(r'^/getTopic/$',views.ForumGetTopic.as_view(), name='getTopic'),
    url(r'^/addTopic/$',views.ForumAddTopic.as_view(),name='addTopic'),
    url(r'^/deleteComment/$', views.ForumDeleteComment.as_view(), name='deleteComment'),
]
