# furia_echo/urls.py  (nível de projeto)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('echo.urls')),   # ← prefixo “/api/” para todas as rotas da app
]
