# echo/openrouter.py
import os, requests, json

OR_KEY = os.getenv("OPENROUTER_API_KEY")           # coloque no .env / settings
OR_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free"

def ask_openrouter(messages, model=DEFAULT_MODEL,
                   max_tokens=120, temperature=0.8) -> str:
    """
    Envia `messages` (lista role/content) ao OpenRouter e devolve
    o texto da IA. Se algo falhar devolve mensagem curta de erro
    para não estourar a view.
    """
    try:
        r = requests.post(
            OR_URL,
            headers={
                "Authorization": f"Bearer {OR_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",   # ou seu domínio
                "X-Title":      "FURIA-Echo",
            },
            json={
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            },
            timeout=45,
        )
        # se o status não for 2xx → levanta para cair no except
        r.raise_for_status()
        data = r.json()

        # às vezes vem {"detail":"..."} ou outro formato
        if "choices" not in data:
            raise ValueError(f"resposta inesperada: {json.dumps(data)[:200]}")

        return data["choices"][0]["message"]["content"].strip()

    except Exception as e:
        # log no console para debug, mas não quebra a aplicação
        print("OpenRouter error:", e)
        return "(IA indisponível no momento 😢)"
