from django.db import models

class Match(models.Model):
    hltv_id      = models.PositiveIntegerField(unique=True)
    event        = models.CharField(max_length=120)
    datetime_utc = models.DateTimeField()
    best_of      = models.CharField(max_length=20)
    opponent     = models.CharField(max_length=60)       # adversário
    maps         = models.CharField(max_length=20)
    stars = models.PositiveSmallIntegerField(null=True, blank=True)
    
# echo/models.py
class Result(models.Model):
    hltv_id      = models.PositiveIntegerField(unique=True)
    event        = models.CharField(max_length=120)
    datetime_utc = models.DateTimeField()
    opponent     = models.CharField(max_length=60)
    score_cta    = models.CharField(max_length=10)   # ex.: “16-12”
    win          = models.BooleanField()

class News(models.Model):
    hltv_id      = models.PositiveIntegerField(unique=True)
    title        = models.CharField(max_length=200)
    url          = models.URLField()
    image        = models.URLField(blank=True)
    published_at = models.DateTimeField()
    summary      = models.TextField()
