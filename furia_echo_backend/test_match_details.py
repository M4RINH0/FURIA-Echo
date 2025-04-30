from echo.match_scraper import fetch_match_details
import json

# Escolha um link válido de match_url já coletado (ex: da lista de recent_results)
match_url = "https://www.hltv.org/matches/2381321/furia-vs-the-mongolz-pgl-bucharest-2025"

# Executa a coleta
details = fetch_match_details(match_url)

# Imprime formatado
print(json.dumps(details, indent=2, ensure_ascii=False))
