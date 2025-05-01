from django.core.management.base import BaseCommand
from echo.services import update_matches_from_scraper
import json
from pathlib import Path
import datetime as dt

class Command(BaseCommand):
    help = "Scrape HLTV team page e atualiza partidas"

    def handle(self, *args, **options):
        self.stdout.write("🔎  Scrapando HLTV…")
        snap = update_matches_from_scraper()

        self.stdout.write(self.style.SUCCESS(
            f"✅  {len(snap['upcoming_matches'])} partidas lidas — "
            f"rank #{snap['ranking'].get('current_rank', '?')}"
        ))

        # Caminho para salvar o JSON
        output_dir = Path("scraper_snapshots")
        output_dir.mkdir(exist_ok=True)   # cria pasta se não existir

        # Nome do arquivo com timestamp UTC
        filename = dt.datetime.utcnow().strftime("latest_snapshot.json")
        output_path = output_dir / filename

        # Salvando
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(snap, f, indent=2, ensure_ascii=False)

        self.stdout.write(self.style.SUCCESS(f"📂 Snapshot salvo em: {output_path}"))
