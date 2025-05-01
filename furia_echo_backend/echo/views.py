import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import datetime as dt

from .scraper import fetch_team_snapshot

WELCOME = (
    "Fala, torcedor da FURIA! Como posso te ajudar hoje?\n"
    "1- Ver os últimos resultados da FURIA 📋\n"
    "2- Conferir as próximas partidas ⌛\n"
    "3- Ficar por dentro dos próximos campeonatos 🔜\n"
    "4- Ver o ranking atual da Valve 📊\n"
    "Escolha uma opção e manda pra gente!"
)

FOLLOW_UP = "\n\nDeseja mais alguma coisa? Se sim, digite 1 para resultados, 2 para próximas partidas, 3 para campeonatos ou 4 para ver o ranking Valve."

@csrf_exempt  # simples para dev – proteja depois!
def furia_chat(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST apenas")

    try:
        body = json.loads(request.body.decode())
        msg = body.get("message", "").strip().lower()
    except Exception:
        return HttpResponseBadRequest("json inválido")

    # menu principal --------------------------------------------------------
    if not msg or msg.isalpha():
        return JsonResponse({"reply": WELCOME})

    # carrega snapshot do scraper (já pronto)
    data = fetch_team_snapshot()

    # opção 1 – últimos resultados -----------------------------------------
    if msg.startswith(("1")):
        lines = []
        for m in data["recent_results"][:5]:
            res = "✅" if m["win"] else "❌"
            lines.append(f"{res} {m['event']}\nFURIA {m['score']} {m['opponent']}")
        return JsonResponse({
            "reply": ("\n\n".join(lines) or "Sem resultados.") + FOLLOW_UP
        })

    # opção 2 – próximas partidas ------------------------------------------
    if msg.startswith("2"):
        up = data["upcoming_matches"]
        if not up:
            return JsonResponse({
                "reply": "Nenhuma partida marcada 😔" + FOLLOW_UP
            })

        lines = []
        for m in up[:5]:
            lines.append(f"🗓 {m['event']} • vs {m['opponent']}")
        return JsonResponse({
            "reply": "\n".join(lines) + FOLLOW_UP
        })

    # opção 3 – próximos campeonatos ---------------------------------------
    if msg.startswith("3"):
        upcoming_events = data["upcoming_events"]  # Dados fornecidos no JSON
        if not upcoming_events:
            return JsonResponse({
                "reply": "Nenhum campeonato futuro encontrado 😔" + FOLLOW_UP
            })

        # Formatar os eventos
        lines = ["Se liga nos nossos próximos encontros:"]
        for event in upcoming_events[:5]:  # Limitar a 5 eventos
            start_date = dt.datetime.fromisoformat(event["start_utc"]).strftime("%d/%m/%Y")
            end_date = dt.datetime.fromisoformat(event["end_utc"]).strftime("%d/%m/%Y")
            lines.append(f"🏆 {event['name']} ({start_date} - {end_date})")

        return JsonResponse({
            "reply": "\n".join(lines) + FOLLOW_UP
        })

    # opção 4 – ranking VALVE ---------------------------------------
    if msg.startswith("4"):
        ranking = data.get("ranking")  # Dados fornecidos no JSON
        if not ranking:
            return JsonResponse({
                "reply": "Ranking atual não disponível no momento 😔" + FOLLOW_UP
            })

        # Formatar o ranking
        current_rank = ranking.get("current_rank", "N/A")
        reply = f"📊 Ranking Valve Atual:\nPosição: #{current_rank}"

        return JsonResponse({
            "reply": reply + FOLLOW_UP
        })
    
    # fallback --------------------------------------------------------------
    return JsonResponse({
        "reply": "Não entendi 🤔 — digite 1, 2, 3 ou 4."
    })