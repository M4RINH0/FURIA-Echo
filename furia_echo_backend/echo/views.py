# echo/views.py
from rest_framework import generics
from .models import Match, News, Result
from .serializers import MatchSerializer, NewsSerializer, ResultSerializer

class NextMatches(generics.ListAPIView):
    serializer_class = MatchSerializer
    queryset = Match.objects.order_by("datetime_utc")

class FuriaNews(generics.ListAPIView):
    serializer_class = NewsSerializer
    queryset = News.objects.order_by("-published_at")[:20]


class RecentResults(generics.ListAPIView):
    serializer_class = ResultSerializer
    queryset = Result.objects.order_by("-datetime_utc")[:20]
