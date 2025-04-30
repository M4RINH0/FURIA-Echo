# echo/serializers.py
from rest_framework import serializers
from .models import Match, News, Result

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Match
        fields = "__all__"

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = News
        fields = "__all__"
        

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Result
        fields = "__all__"

