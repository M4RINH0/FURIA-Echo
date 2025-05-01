# 🎧 FURIA Echo

**FURIA Echo** é um web-chat onde o torcedor conversa com ecos digitais dos
jogadores da FURIA (CS 2) *e* com a própria organização.  
As respostas combinam **dados em tempo-real do HLTV** (próximas partidas,
resultados, ranking, campeonatos) com **IA gratuita** servida pela
[OpenRouter](https://openrouter.ai).

---

## 🧠 Como funciona

1. O usuário escolhe um eco (persona).  
2. O frontend envia a mensagem para o backend Django.
3. Django gera um *prompt* usando um **arquivo Markdown** com a história do
   jogador (ex.: `personas/fallen.md`) + a frase do usuário.
4. A mensagem é enviada ao modelo **`google/gemini-2.0-flash-exp:free`** via
   OpenRouter.  
5. A resposta chega ao React e aparece na bolha do chat.
6. Para a persona **“FURIA”** o backend não usa IA: responde com dados
   fresquinhos do snapshot HLTV.

---

### Personagens

| id       | Avatar | Personalidade curta                                   |
|----------|--------|-------------------------------------------------------|
| `furia`  | 🐯     | Menu 1-4 com resultados, calendário, ranking          |
| `fallen` | 🧔     | Professor tático, responde calmo e didático           |
| `ksc`    | 🎯     | KSCERATO, direto e clutch                               |
| `yuurih` | 🔥     | Agressivo, confiante                                   |
| `sidde`  | 🎙️     | Coach, foco estratégico                                |

*(adicione mais ecos criando um `personas/<id>.md` e colocando o avatar em
 `src/assets/avatars/`)*

---

## 💻 Stack

| Camada      | Techs                               |
|-------------|-------------------------------------|
| **Front**   | React + Vite · TailwindCSS          |
| **Back**    | Django 5 · Django REST Framework · `cloudscraper` |
| **IA**      | Google Gemini-2.0 Flash (via OpenRouter) |
| **Scraper** | HLTV (próximas partidas, resultados, eventos, ranking) |
| **Hospedagem** | **Vercel** (front) · **Railway** (back) |

---

## 🖼️ Layout

Interface inspirada no WeChat do Vision Pro (bubbles arredondadas, sidebar
flutuante, input fixo ao rodapé).

<p align="center">
  <img src="./assets/Furia%20ECHO.png" alt="Protótipo FURIA Echo" width="700">
</p>

---

## 🚀 Rodando localmente

### 1. Backend (Django)

```bash
# raiz do repo
cd furia_echo_backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt  # django, djangorestframework, cloudscraper, etc.

# .env com segredos
cat > .env <<EOF
DJANGO_SECRET_KEY=dev-key
OPENROUTER_API_KEY=xxxxxxxxxxxxxxxx
DEBUG=True
EOF

# popula primeiro snapshot HLTV e inicia
python manage.py fetch_hltv
python manage.py runserver
```
### 2. Frontend (React + Vite)

```bash
cd furia_echo_frontend
npm install
# opcional .env  →  VITE_API_BASE=http://localhost:8000/api
npm run dev
```
Acesse http://localhost:5173.

## 📂 Estrutura
```
furia-echo/
├── furia_echo_backend/
│   ├── echo/              # app Django (views, scraper, personas, ...)
│   ├── furia_echo/        # settings, urls, wsgi
│   └── requirements.txt
├── furia_echo_frontend/
│   ├── src/
│   │   ├── components/    # ChatSidebar, ChatArea, etc.
│   │   ├── pages/         # Home, Chat
│   │   └── services/      # chatServices.js
│   └── vite.config.js
└── README.md
```

## 🔁 Endpoints principais (backend)
| Rota                         | Método | Descrição                             |
|------------------------------|--------|---------------------------------------|
| `/api/chat/furia/`           | POST   | Menu 1-4 (usa snapshot HLTV)          |
| `/api/chat/player/<id>/`     | POST   | IA do jogador `<id>`                  |
| `/api/chat/reset/`           | POST   | Limpa contexto OpenRouter no servidor |

## 📚 Créditos
| Área        | Fonte                                          |
|-------------|------------------------------------------------|
| Dados       | HLTV, Liquipedia, entrevistas, redes da FURIA  |
| IA          | OpenRouter (modelo gratuito **Gemini 2.0 Flash**) |
| Dev & UI    | Douglas Marinho Martins                        |

## 📬 Contato
Abra uma issue ou fale comigo no https://www.linkedin.com/in/dodax/.

Vamo pra cima, FURIOSOS! 🐯