import json
from _mysql import DatabaseError

from django.core import serializers
from django.db.models import Model
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
import datetime


# klasa zwracajaca szczegolowy widok artykulu wraz z modelem jako parametr pobiera id artykulu
from django.views import View
from django.views.generic import DetailView
from django.views.generic import ListView

from articles.models import News, Comments, AuthUser


class SingleArticle(DetailView):
    model = News
    template_name = 'post.html'
    pk_url_kwarg = 'post_id'
    post_id =0

    def get_context_data(self, **kwargs):
        context = super(SingleArticle, self).get_context_data(**kwargs)
        SingleArticle.post_id = self.kwargs['post_id']
        if SingleArticle.post_id.isdigit():
            context['news'] = News.objects.get(id=SingleArticle.post_id)
            return context
        else:
            return context


class GetSingleArticle(View):

    def post(self, request):
        id =int(request.POST['idNews'])
        if id <= 0:
            news = News.objects.get(id=SingleArticle.post_id)
        else:
            news = News.objects.get(id=id)
        if news is None:
            news.longnews = " "
        serialized_obj = serializers.serialize('json', [news, ])
        return HttpResponse(serialized_obj, content_type="application/json")



class UpdateSingleArticle(View):

    def post(self,request):
        longNews = request.POST['longNews']
        try:
            news = News.objects.get(id = SingleArticle.post_id)
            news.longnews = longNews
            news.save()
            return JsonResponse({'response':'OK'})
        except DatabaseError:
            return JsonResponse({'response':'FAIL'})


class AddComments(View):

    def post(self,request):
        comments = json.loads(request.body)
        current_user = request.user
        user = AuthUser.objects.get(id=current_user.id)
        news = News.objects.get(id=SingleArticle.post_id)
        createdbyadmin = True if user.is_superuser else False
        if comments['Parent'] is not None:
            parent = comments['Parent'] if comments['Parent'].isdigit() else None
        else:
            parent =comments['Parent']
        try:
            c = Comments(content = comments['content'],created=comments['created'],
                     createdbyadmin = createdbyadmin,fullname=user.username,idcomments=comments['id'],
                     modified=comments['modified'],parent=parent,
                     profilepictureurl=comments['profile_picture_url'],upvotecount=0,
                     idnews=news,auth_user= user)
            c.save()
            return JsonResponse({'response': 'OK'})
        except DatabaseError:
            return JsonResponse({'response': 'FAIL'})

class GetComments(View):

    def post(self,request):
        news = News.objects.get(id=SingleArticle.post_id)
        try:
            list = []
            for element in Comments.objects.filter(idnews=news):
                comment = CommentsModel(id=element.id,parent=element.parent,created=element.created,
                                        modified=element.modified,content=element.content,fullName=element.fullname,
                                        profilePictureUrl=element.profilepictureurl,createdByAdmin=element.createdbyadmin,
                                        upvote_count=element.upvotecount)
                list.append(comment)

            json_string = json.dumps([ob.__dict__ for ob in list])

            return HttpResponse(json_string)
        except DatabaseError:
            return JsonResponse({'response': 'FAIL'})


class CommentsModel:

    def __init__(self,id,parent,created,modified,content,fullName,profilePictureUrl,createdByAdmin,upvote_count):
        self.id =id
        self.Parent=parent
        self.created=created
        self.modified=modified
        self.content=content
        self.fullName=fullName
        self.profilePictureUrl=profilePictureUrl
        self.createdByAdmin=createdByAdmin
        self.upvote_count=upvote_count


'''
class GetComments(ListView):
    queryset = News.objects.all()

    def post(self, request, *args, **kwargs):
        data = {}
        data["users"] = get_json_list(GetComments.queryset)
        return JsonResponse(data)


def get_json_list(query_set):
    list_objects = []
    for obj in query_set:
        dict_obj = {}
        for field in obj._meta.get_fields():
            try:
                if field.many_to_many:
                    dict_obj[field.name] = get_json_list(getattr(obj, field.name).all())
                    continue
                dict_obj[field.name] = getattr(obj, field.name)
            except AttributeError:
                continue
        list_objects.append(dict_obj)
    return list_objects

'''


class UpvoteComment(View):

    def post(self,request):
        comment = json.loads(request.body)

        comm= Comments.objects.get(id=comment['id'])
        comm.upvotecount+=1
        comm.save()
        return JsonResponse({'response': 'OK'})


class DeleteComment(View):

    def get(self,request):
        try:
            comment = Comments.objects.get(idcomments=request.GET['commentId'])
            comment.delete()
            return JsonResponse({'response': 'OK'})
        except DatabaseError:
            return JsonResponse({'response': 'FAIL'})

class EditComment(View):

    def post(self,request):
        try:
            comment = json.loads(request.body)
            comm = Comments.objects.get(idcomments=comment['id'])
            comm.content=comment['content']
            comm.save()
            return JsonResponse({'response': 'OK'})
        except DatabaseError:
            return JsonResponse({'response': 'FAIL'})
