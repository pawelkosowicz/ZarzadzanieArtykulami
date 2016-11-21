from _mysql_exceptions import DatabaseError
from django.contrib.auth.decorators import login_required
from django.db.models import Model
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from django.utils.decorators import method_decorator
from django.views import View
from django.views.generic import ListView
from articles.models import Forumtopics,Forumcomments,AuthUser
from django.utils import timezone

# klasa liste objektow forum
class Forum(View):

    def get(self, request):
        forumList = []
        for element in Forumtopics.objects.all():
            forum = Forumtopics()
            forum.topic = element.topic
            forum.description = element.description
            forum.postcount = element.postcount
            forum.id = element.id
            comments = Forumcomments.objects.filter(idforumtopic=element.id)
            if not comments:
                forum.username = ''
                forum.lastPost = ''
            else:
                forum.username =comments[0].auth_user.username
                forum.lastPost = comments[0].datetime
            forumList.append(forum)

        return render(request, 'forum.html', {'forumList': forumList})

        '''
    def get_context_data(self, **kwargs):
        forumList = []
        forumTopic = Forumtopics.objects.all()
        for element in forumTopic:
            forum = Forumtopics()
            forum.topic = element.topic
            forum.description = element.description
            forum.postcount = element.postcount
            comments = Forumcomments.objects.order_by('-idforumtopic').get(idforumtopic = element.idforumtopic)[:1]
            forum.lastPost = comments.datetime
            forumList.append(forum)

        return {'forumList':forumList}
        '''

   # @method_decorator(login_required)
   # def dispatch(self, *args, **kwargs):
   #     return super(Forum, self).dispatch(*args, **kwargs)

class ForumTopicComments(ListView):
    template_name = 'forumcomments.html'
    model = Forumcomments
    forumTopicId = 0

   # def get(self,request,topic_id):
    #    topic_id = self.kwargs['topic_id']
   #     return {'forumComments':Forumcomments.objects.filter(idforumtopic = topic_id)}


    def get_context_data(self, **kwargs):
       context = super(ForumTopicComments, self).get_context_data(**kwargs)
       ForumTopicComments.forumTopicId = self.kwargs['topic_id']
       context['forumComments'] = Forumcomments.objects.filter(idforumtopic = ForumTopicComments.forumTopicId)
       return context


class ForumGetComments(ListView):
    template_name = '_forumcomments.html'
    model = Forumcomments

   # def get(self,request,topic_id):
    #    topic_id = self.kwargs['topic_id']
   #     return {'forumComments':Forumcomments.objects.filter(idforumtopic = topic_id)}

    def get(self, request):
        return render(request,'_forumcomments.html' , {'forumComments': Forumcomments.objects.filter(idforumtopic = ForumTopicComments.forumTopicId)})




class ForumAddComment(View):

    def post(self,request):
        forumTopics = Forumtopics.objects.get(id=ForumTopicComments.forumTopicId)
        forumTopics.postcount+=1
        forumTopics.save()
        current_user = request.user
        dateTime = timezone.localtime(timezone.now()).strftime('%d %b %Y, %H:%M')
        user = AuthUser.objects.get(id=current_user.id)
        try:
            comments = Forumcomments(comments=request.POST['comments'],datetime=dateTime,idforumtopic=forumTopics,auth_user=user)
            comments.save()
            return HttpResponse("OK")
        except DatabaseError:
            return HttpResponse("FAIL")

class ForumDeleteComment(View):

    def post(self,request):
        id = request.POST['commentsId']
        if id.isdigit():
            forumTopics = Forumtopics.objects.get(id=ForumTopicComments.forumTopicId)
            forumTopics.postcount -= 1
            forumTopics.save()
            try:
                comments =Forumcomments.objects.get(id=id)
                comments.delete()
                return HttpResponse("OK")
            except DatabaseError:
                return HttpResponse("FAIL")
        else:
            return HttpResponse("FAIL")

class ForumDeleteTopic(View):

    def post(self,requset):
        id = requset.POST['forumId']
        if id.isdigit():
            try:
                forumTopics = Forumtopics.objects.get(id=id)
                forumTopics.delete()
                return HttpResponse("OK")
            except DatabaseError:
                return HttpResponse("FAIL")
        else:
            return HttpResponse("FAIL")


class ForumGetTopic(ListView):
    template_name = '_forum.html'
    model = Forumtopics

    def post(self,request):
        forumList = []
        for element in Forumtopics.objects.all():
            forum = Forumtopics()
            forum.topic = element.topic
            forum.description = element.description
            forum.postcount = element.postcount
            forum.id = element.id
            comments = Forumcomments.objects.filter(idforumtopic=element.id)
            if not comments:
                forum.username = ''
                forum.lastPost = ''
            else:
                forum.username = comments[0].auth_user.username
                forum.lastPost = comments[0].datetime
            forumList.append(forum)

            return render(request, '_forum.html', {'forumList': forumList})

class ForumTopic(Model):
    id = 0
    topic =''
    description =''
    postcount = 0
    lastPost = ''
    username = ''


