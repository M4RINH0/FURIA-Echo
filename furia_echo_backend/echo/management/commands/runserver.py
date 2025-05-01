# echo/management/commands/runserver.py
import os
from django.core.management.commands.runserver import Command as DjangoRunserver
from django.core.management import call_command


class Command(DjangoRunserver):

    def handle(self, *args, **options):
        # Evita rodar duas vezes no processo filho do autoreload
        if not os.environ.get("RUN_MAIN"):
            self.stdout.write(self.style.MIGRATE_HEADING("▶ Atualizando snapshot HLTV…"))
            try:
                call_command("fetch_hltv")
            except Exception as exc:
                self.stderr.write(self.style.ERROR(f"Erro ao atualizar HLTV: {exc}"))
            self.stdout.write("")  # linha em branco

        # segue o runserver normal
        super().handle(*args, **options)
