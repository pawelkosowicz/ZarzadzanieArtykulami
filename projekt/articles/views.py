from django.utils import timezone

from _mysql_exceptions import DatabaseError
from django.core import serializers
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from models import News, AuthUser
from django.views.generic import TemplateView,DetailView,ListView

# klasa zwracajaca statyczny widok wraz z lista danych


class Main(ListView):
    template_name = 'news.html'
    model = News

    def get_context_data(self, **kwargs):
       list =[]
       news =News.objects.all().order_by('id').reverse()[:5]
       if news.count() <=0:
           list.append(News(id=0,title="Dodaj artykul",shortnews="test",datatime="",imageurl=""))
           news = list

       return {'news':news}


class OldNews(ListView):
    template_name = '_news.html'
    model = News
    news=5
    maxNews=5

    def post(self,request):
        OldNews.news+=OldNews.maxNews
        return render(request,OldNews.template_name,{'news':News.objects.all().order_by('id').reverse()[:OldNews.news]})



class Articles(View):

    def post(self, request):
        return render(request, '_news.html', {'news':News.objects.all().order_by('id').reverse()[:5]})


class DeleteNews(View):

    def post(self,request):
        id = request.POST['id']
        if id.isdigit():
            try:
                news = News.objects.get(id=id)
                news.delete()
                return JsonResponse({'response':'OK'})
            except DatabaseError:
                return JsonResponse({'response': 'FAIL'})
        else:
            return JsonResponse({'response': 'FAIL'})

class EditNews(View):
    def post(self, request):
        id = request.POST['id']
        title= request.POST['title']
        shortNews =request.POST['shortNews']
        if id.isdigit():
            try:
                news = News.objects.get(id=id)
                news.title = title
                news.shortnews = shortNews
                news.save()
                return JsonResponse({'response': 'OK'})
            except DatabaseError:
                return JsonResponse({'response': 'FAIL'})
            else:
                return JsonResponse({'response': 'FAIL'})

class AddNews(View):

    def post(self, request):
        title = request.POST['title']
        shortNews = request.POST['shortNews']
        try:
            current_user = request.user
            user = AuthUser.objects.get(id=current_user.id)
            datatime = timezone.localtime(timezone.now()).strftime('%d %b %Y')
            news = News(title=title,datatime=datatime,shortnews=shortNews,auth_user =user)
            news.save()
            return JsonResponse({'response': 'OK'})
        except DatabaseError:
            return JsonResponse({'response': 'FAIL'})


  # return render(request, self.template_name, {'news': News.objects.get(id=SingleArticle.post_id)})

  #class SendEmail(DetailView):
  #  model = News
   # template_name = 'post.html'
   # pk_url_kwarg = 'post_id'

   # def post(self, post_id):
   #     return {'post':News.objects.get(id=post_id)}

   # def post(self,post_id):
   #     return {'post':News.objects.get(id=post_id)}


#def news(request):
 #   return render(request, 'news.html', {'news' : News.objects.all()})

#def main(request):
 #   return render(request, 'news.html', {})

#def user(request):
  #  return render(request, 'user.html', {})

#def contact(request):
 #   return render(request, 'contact.html', {})

#def post(request, post_id):
#    return render(request, 'post.html', {'post':News.objects.get(id=post_id)})

