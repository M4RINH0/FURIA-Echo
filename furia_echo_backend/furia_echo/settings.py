# furia_echo/settings.py
from pathlib import Path
from dotenv import load_dotenv
import os, sys

BASE_DIR = Path(__file__).resolve().parent.parent

# carrega .env se existir ─ antes de usar os valores
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-dev-key")
DEBUG      = os.getenv("DEBUG", "False") == "True"


# ─────────────────────  APLICAÇÕES  ─────────────────────────
INSTALLED_APPS = [
    #  Django
    "echo",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",   
]

# ─────────────────────  MIDDLEWARE  ─────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",        #  deve vir primeiro
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = "furia_echo.urls"


# ───────────────────  TEMPLATES / WSGI  ─────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "furia_echo.wsgi.application"


# ───────────────────────  BANCO  ────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# REST apenas JSON (opcional)
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}


# ───────────────────  INTERNACIONALIZAÇÃO  ──────────────────
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ─────────────────────  STATICFILES  ────────────────────────
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ────────────────────────  CORS  ────────────────────────────
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",       #  Vite dev-server
]
# Se preferir liberar tudo durante o dev:
# CORS_ALLOW_ALL_ORIGINS = True
