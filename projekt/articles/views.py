from django.shortcuts import render
from django.views import View

from models import News
from django.views.generic import TemplateView,DetailView,ListView

# klasa zwracajaca statyczny widok wraz z lista danych


class Main(ListView):
    template_name = 'news.html'
    model = News

    def get_context_data(self, **kwargs):
       # context = super(Main, self).get_context_data(**kwargs)
       # context['news'] = News.objects.all()
        return {'news':News.objects.all()[:5]}


class OldNews(ListView):
    template_name = '_news.html'
    model = News
    news=5
    maxNews=5

    def post(self,request):
        OldNews.news+=OldNews.maxNews
        return render(request,OldNews.template_name,{'news':News.objects.all()[:OldNews.news]})



class Articles(View):

    def post(self, request):
        return render(request, '_news.html', {'news':News.objects.all})


# klasa zwracajaca szczegolowy widok artykulu wraz z modelem jako parametr pobiera id artykulu
class SingleArticle(DetailView):
    model = News
    template_name = 'post.html'
    pk_url_kwarg = 'post_id'

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

