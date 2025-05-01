# echo/views.py
import json, datetime as dt
from pathlib import Path
from collections import defaultdict, deque

from django.http                    import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf   import csrf_exempt
from django.views.decorators.http   import require_POST

from .scraper     import fetch_team_snapshot   # HLTV snapshot
from .openrouter  import ask_openrouter        # helper que já usa sua chave

# ────────────────────────────────────────────────────────────────────────
# 1.  Personas  ----------------------------------------------------------
# ────────────────────────────────────────────────────────────────────────
BASE_DIR      = Path(__file__).resolve().parent
PERSONA_DIR   = BASE_DIR / "personas"          # fallen.md, ksc.md, …

_PERSONA_CACHE = {}                            # {player_id: texto}

def _load_persona(player_id: str, nick: str) -> str:
    """Retorna o prompt do jogador; lê do disco apenas uma vez."""
    if player_id in _PERSONA_CACHE:
        return _PERSONA_CACHE[player_id]

    fp = PERSONA_DIR / f"{player_id}.md"
    if fp.exists():
        text = fp.read_text(encoding="utf-8").strip()
    else:
        text = (f"Você é {nick}, jogador profissional da FURIA (CS2). "
                "Responda em português BR, tom amistoso, no máximo 2 frases.")

    _PERSONA_CACHE[player_id] = text
    return text


# ────────────────────────────────────────────────────────────────────────
# 2.  Históricos em memória  --------------------------------------------
# ────────────────────────────────────────────────────────────────────────
_HISTORY = defaultdict(lambda: deque(maxlen=12))   # {player_id: deque}

def _get_history(player_id: str, system_prompt: str):
    """Garante que o deque tenha o system prompt na 1ª posição."""
    hist = _HISTORY[player_id]
    if not hist:                                   # primeira vez
        hist.append({"role": "system", "content": system_prompt})
    return hist

def _reset_history(player_id: str):
    _HISTORY.pop(player_id, None)


# ────────────────────────────────────────────────────────────────────────
# 3.  Mensagens fixas (chat FURIA)  -------------------------------------
# ────────────────────────────────────────────────────────────────────────
WELCOME = (
    "Fala, torcedor da FURIA! Como posso te ajudar hoje?\n"
    "1- Últimos resultados 📋\n"
    "2- Próximas partidas ⌛\n"
    "3- Próximos campeonatos 🔜\n"
    "4- Ranking Valve 📊\n"
    "Escolha uma opção e mande pra gente!"
)
FOLLOW_UP = (
    "\n\nAlgo mais? Digite 1 (resultados), 2 (partidas), "
    "3 (campeonatos) ou 4 (ranking)."
)


# ────────────────────────────────────────────────────────────────────────
# 4.  Chat “FURIA” (menu estático)  -------------------------------------
# ────────────────────────────────────────────────────────────────────────
@csrf_exempt
@require_POST
def furia_chat(request):
    try:
        msg = json.loads(request.body.decode()).get("message", "").strip().lower()
    except Exception:
        return HttpResponseBadRequest("JSON inválido")

    if not msg or msg.isalpha():
        return JsonResponse({"reply": WELCOME})

    data = fetch_team_snapshot()                                # HLTV snapshot

    # 1) Resultados recentes ------------------------------------------------
    if msg.startswith("1"):
        lines = []
        for m in data["recent_results"][:5]:
            res = "✅" if m["win"] else "❌"
            lines.append(f"{res} {m['event']}\nFURIA {m['score']} {m['opponent']}")
        reply = "\n\n".join(lines) if lines else "Sem resultados."
        return JsonResponse({"reply": reply + FOLLOW_UP})

    # 2) Próximas partidas --------------------------------------------------
    if msg.startswith("2"):
        up = data["upcoming_matches"]
        if not up:
            return JsonResponse({"reply": "Nenhuma partida marcada 😔" + FOLLOW_UP})
        lines = [f"🗓 {m['event']} • vs {m['opponent']}" for m in up[:5]]
        return JsonResponse({"reply": "\n".join(lines) + FOLLOW_UP})

    # 3) Próximos campeonatos ----------------------------------------------
    if msg.startswith("3"):
        ev = data["upcoming_events"]
        if not ev:
            return JsonResponse({"reply": "Sem campeonatos futuros 😔" + FOLLOW_UP})
        lines = ["Se liga nos próximos compromissos:"]
        for e in ev[:5]:
            ini = dt.datetime.fromisoformat(e["start_utc"]).strftime("%d/%m/%Y")
            fim = dt.datetime.fromisoformat(e["end_utc"]).strftime("%d/%m/%Y")
            lines.append(f"🏆 {e['name']} ({ini}-{fim})")
        return JsonResponse({"reply": "\n".join(lines) + FOLLOW_UP})

    # 4) Ranking Valve ------------------------------------------------------
    if msg.startswith("4"):
        pos = data.get("ranking", {}).get("current_rank", "N/A")
        return JsonResponse({"reply": f"📊 Ranking Valve Atual\nPosição: #{pos}" + FOLLOW_UP})

    return JsonResponse({"reply": "Não entendi 🤔 — digite 1, 2, 3 ou 4."})


# ────────────────────────────────────────────────────────────────────────
# 5.  Chat dos jogadores (IA / OpenRouter)  ------------------------------
# ────────────────────────────────────────────────────────────────────────
NICK_MAP = {
    "fallen":  "FalleN",
    "ksc":     "KSCERATO",
    "yuurih":  "yuurih",
    "sidde":   "sidde",
}

@csrf_exempt
@require_POST
def player_chat(request, player_id):
    nick = NICK_MAP.get(player_id)
    if not nick:
        return HttpResponseBadRequest("Jogador desconhecido")

    try:
        payload = json.loads(request.body.decode())
    except Exception:
        return HttpResponseBadRequest("JSON inválido")

    # permite reset via {"reset": true}
    if payload.get("reset"):
        _reset_history(player_id)
        return JsonResponse({"reply": "(histórico zerado ✅)"})

    user_msg = (payload.get("message") or "").strip()
    if not user_msg:
        return JsonResponse({"reply": "(mensagem vazia)"})

    system_prompt = _load_persona(player_id, nick)
    hist          = _get_history(player_id, system_prompt)

    # adiciona mensagem do usuário
    hist.append({"role": "user", "content": user_msg})

    try:
        ai_reply = ask_openrouter(list(hist))        # envia histórico
        hist.append({"role": "assistant", "content": ai_reply})
    except Exception as e:
        print("OpenRouter error:", e)
        ai_reply = "(erro ao consultar IA) 😢"

    return JsonResponse({"reply": ai_reply})

@csrf_exempt
@require_POST
def reset_all_conversations(request):
    """
    Apaga todo o histórico salvo no banco/cache.
    Se você ainda não persiste nada, apenas retorna OK.
    """
    try:
        # Se um dia você criar uma tabela de mensagens, descomente ↓
        # from .models import ConversationMessage
        # ConversationMessage.objects.all().delete()
        return JsonResponse({"status": "ok"})
    except Exception as exc:
        print("reset error:", exc)
        return HttpResponseBadRequest("erro")
