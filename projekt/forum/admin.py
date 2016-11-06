from django.contrib import admin
from articles.models import Forumcomments,Forumtopics
# Register your models here.

admin.site.register([Forumtopics,Forumcomments])