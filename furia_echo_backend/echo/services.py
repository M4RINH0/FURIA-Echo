from .models import Match, Result
from .scraper import fetch_team_snapshot

def update_matches_from_scraper():
    data = fetch_team_snapshot()

    # salva próximos
    for m in data["upcoming_matches"]:
        Match.objects.update_or_create(
            hltv_id=m["hltv_id"],
            defaults={
                "event": m["event"],
                "datetime_utc": m["datetime_utc"],
                "opponent": m["opponent"],
            },
        )

    # salva resultados
    for r in data["recent_results"]:
        Result.objects.update_or_create(
            hltv_id=r["hltv_id"],
            defaults={
                "event": r["event"],
                "datetime_utc": r["datetime_utc"],
                "opponent": r["opponent"],
                "score_cta": r["score"],
                "win": r["win"],
            },
        )

    return data