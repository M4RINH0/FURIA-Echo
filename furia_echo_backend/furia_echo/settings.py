# furia_echo/settings.py
from pathlib import Path
from dotenv import load_dotenv
import os, dj_database_url  # pip install python-dotenv dj-database-url

# ───────────────────────────────────────────────────────────────
# Diretórios e .env
# ───────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")  # Em produção, use Secrets da plataforma

# ────────────────── Básico / Segurança ────────────────────────
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-dev-key")
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "localhost", "127.0.0.1",  # Dev local
    ".railway.app",            # Backend Railway
    ".vercel.app",             # Frontend Vercel
]

CSRF_TRUSTED_ORIGINS = [
    "https://*.railway.app",
    "https://*.vercel.app",
]

# ────────────────── Apps / Middleware ─────────────────────────
INSTALLED_APPS = [
    # Apps da aplicação
    "echo",

    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Terceiros
    "corsheaders",
    "rest_framework",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ────────────────── URLs / Templates / WSGI ───────────────────
ROOT_URLCONF = "furia_echo.urls"

TEMPLATES = [{
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
}]

WSGI_APPLICATION = "furia_echo.wsgi.application"

# ────────────────── Banco de dados ────────────────────────────
# Local → sqlite | Produção → variável DATABASE_URL (Railway já fornece)
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR/'db.sqlite3'}",
        conn_max_age=600,
    )
}

# ────────────────── REST Framework ────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}

# ────────────────── Internacionalização ───────────────────────
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ────────────────── Arquivos estáticos ────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # Coletados no deploy

# WhiteNoise: gzip + manifest
STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ────────────────── CORS ──────────────────────────────────────
if DEBUG:
    # Durante o dev, aceitamos qualquer origem (Vite)
    CORS_ALLOW_ALL_ORIGINS = True
else:
    # Produção – permita apenas o front Vercel (ou domínios próprios)
    CORS_ALLOWED_ORIGINS = [
        "https://furia-echo.vercel.app",  # Frontend prod
    ]
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://.*\.vercel\.app$",
    ]
