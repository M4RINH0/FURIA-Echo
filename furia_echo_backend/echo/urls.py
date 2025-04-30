from django.urls import path
from . import views
urlpatterns = [
    path("matches/", views.NextMatches.as_view()),
    path("news/",    views.FuriaNews.as_view()),
    path("results/", views.RecentResults.as_view()),
]
