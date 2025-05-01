# echo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('chat/echoes',                   views.echoes,        name='echoes'),
    path('chat/<slug:eco_id>/messages',   views.messages,      name='messages'),
    path('chat/furia/answer',             views.furia_answer,  name='furia_answer'),
]
