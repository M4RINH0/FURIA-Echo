from django.urls import path
from . import views

urlpatterns = [
    path("chat/furia/",   views.furia_chat,    name="furia"),
    path("chat/player/<str:player_id>/", views.player_chat, name="player"),
    path("chat/reset/",   views.reset_all_conversations,    name="reset"),   # ← novo
]
