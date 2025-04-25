# 🎧 FURIA Echo

**FURIA Echo** é um web chat interativo onde fãs da FURIA podem conversar com ecos digitais de ídolos do time de CS:GO, como **FalleN**, **Guerri**, **Sidde**, **KSCERATO**, **yuurih** e até com **"a FURIA"**, uma persona que representa a organização em si.  
As respostas são geradas por uma **IA gratuita** e treinada com **conteúdos reais**, como entrevistas, notícias, estatísticas e curiosidades sobre o time e seus membros.

---

## 🧠 Como funciona

O usuário escolhe com quem quer conversar, e cada personagem responde com base em sua **personalidade real**, **estilo de fala** e **conhecimento específico**. A IA é limitada por uma base de dados curada para garantir fidelidade e coerência nas respostas.

### Personagens disponíveis:
- 🧔 **FalleN** — o professor tático, responde com profundidade e calma
- 🧢 **Guerri** — o antigo coach, mostrando conhecimento e vivencia na organização
- 🎙️ **Sidde** — o coach, focado no time e na preparação
- 🎯 **KSCERATO** — o foco no clutch, frio e direto
- 🔥 **yuurih** — agressivo e confiante, sempre com energia
- 🐯 **a FURIA** — a organização em si, responde sobre notícias, próximos jogos e estrutura do time

---

## 💻 Stack utilizada

- **Frontend**: React + TailwindCSS
- **Backend**: Django + Django REST Framework
- **IA**: [LLaMA (LNM)](https://openrouter.ai) via OpenRouter API (modelo gratuito)
- **Hospedagem**: Vercel (frontend) + Railway/Render/Heroku (backend, opcional)
- **Design de referência**: WeChat no Apple Vision Pro

---

## 🖼️ Protótipo

Interface inspirada no WeChat do Vision Pro, com visual limpo, moderno e imersivo para focar no conteúdo das conversas.

![Protótipo FURIA Echo](./assets/Furia%20ECHO.png)

---

## 🚀 Como rodar localmente

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt

# Crie um .env com sua chave da OpenRouter
touch .env
```

`.env`
```
OPENROUTER_API_KEY=your_openrouter_key_here
```

```bash
python manage.py runserver
```

---

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔁 Fluxo de funcionamento

1. Usuário acessa o chat e escolhe um personagem.
2. Frontend envia a mensagem + personagem escolhido para o backend Django.
3. Django monta o prompt específico com base no personagem.
4. Backend envia a solicitação para o modelo **LLaMA (LNM)** via OpenRouter.
5. A resposta é retornada ao frontend para exibição no chat.

---

## 📂 Estrutura do projeto

```
furia-echo/
├── backend/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/     # UI do chat
│   │   ├── pages/
│   │   └── services/       # API calls
├── assets/                 # Protótipos, imagens, logos
└── README.md
```

---

## 💬 Exemplos de perguntas

- "FalleN, como você prepara a equipe mentalmente antes de um Major?"
- "Guerri, qual é a principal diferença do time de 2020 pro atual?"
- "FURIA, qual é o próximo jogo do time?"
- "Sidde, explique como funciona um clutch 1v3 do KSCERATO!"
- "yuurih, como você mantém o foco mesmo quando o time está perdendo?"

---

## 📽️ Vídeo demonstrativo

🎥 Em breve: link para o vídeo com tour completo pela aplicação.

---

## 📚 Créditos

- Desenvolvido por: Douglas Marinho Martins
- Dados base: HLTV, Liquipedia, Twitter da FURIA, entrevistas e fontes oficiais
- IA: [OpenRouter](https://openrouter.ai) - Modelo gratuito LLaMA (LNM)

---

## 📬 Contato

Sugestões ou dúvidas?  
Me chama no [LinkedIn](https://www.linkedin.com/in/dodax/) ou abra uma issue aqui no GitHub!
