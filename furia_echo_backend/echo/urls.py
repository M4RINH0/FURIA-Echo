# echo/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("chat/furia/", views.furia_chat, name="furia_chat"),
]
