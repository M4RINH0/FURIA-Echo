# echo/match_scraper.py

import datetime as dt
import re
from typing import List, Dict

import cloudscraper
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

# ----------------------------------------------------------------------------
# Configurações do Scraper
# ----------------------------------------------------------------------------
_scraper = cloudscraper.create_scraper(
    delay=1,
    browser={"custom": f"{UserAgent().random} (FuriaEcho)"}
)

def _get_html(url: str) -> str:
    r = _scraper.get(url, timeout=15)
    r.raise_for_status()
    return r.text

def _clean_text(text: str) -> str:
    return text.strip().replace("\n", " ").replace("\t", " ")

# ----------------------------------------------------------------------------
# Coleta de Vetos
# ----------------------------------------------------------------------------
def get_vetos(soup: BeautifulSoup) -> List[str]:
    veto_box = soup.select_one(".veto-box .padding")
    if not veto_box:
        return []
    return [div.text.strip() for div in veto_box.find_all("div")]

# ----------------------------------------------------------------------------
# Coleta de Mapas
# ----------------------------------------------------------------------------
def get_maps(soup: BeautifulSoup) -> List[Dict]:
    maps = []
    mapholders = soup.select(".mapholder")

    for holder in mapholders:
        map_name_tag = holder.select_one(".mapname")
        if not map_name_tag:
            continue

        map_name = map_name_tag.text.strip()

        team1_block = holder.select_one(".results-left")
        team2_block = holder.select_one(".results-right")

        team1 = {
            "name": team1_block.select_one(".results-teamname").text.strip(),
            "score": team1_block.select_one(".results-team-score").text.strip(),
        } if team1_block else {"name": "", "score": ""}

        team2 = {
            "name": team2_block.select_one(".results-teamname").text.strip(),
            "score": team2_block.select_one(".results-team-score").text.strip(),
        } if team2_block else {"name": "", "score": ""}

        half_score = holder.select_one(".results-center-half-score")
        half_score_text = half_score.text.strip() if half_score else ""

        stats_link = holder.select_one(".results-center-stats a")
        stats_url = f"https://www.hltv.org{stats_link['href']}" if stats_link else ""

        maps.append({
            "map_name": map_name,
            "team1": team1,
            "team2": team2,
            "half_score": half_score_text,
            "stats_url": stats_url,
        })

    return maps

# ----------------------------------------------------------------------------
# Coleta de Estatísticas por Jogador
# ----------------------------------------------------------------------------
def parse_player_stats(soup: BeautifulSoup) -> Dict:
    stats = {
        "total": [],
        "ct": [],
        "t": [],
    }

    tables = {
        "total": soup.select("table.totalstats"),
        "ct":    soup.select("table.ctstats"),
        "t":     soup.select("table.tstats"),
    }

    for key, table_list in tables.items():
        for table in table_list:
            team_name = table.select_one("div.align-logo a.teamName")
            if not team_name:
                continue

            team = team_name.text.strip()

            rows = table.select("tr:not(.header-row)")
            for row in rows:
                try:
                    player_a = row.select_one(".flagAlign a")
                    player_link = player_a["href"] if player_a else ""
                    player_id = int(player_link.split("/")[2]) if player_link else None
                    player_nick = player_a.select_one(".player-nick").text.strip() if player_a else "Unknown"

                    kd        = row.select_one(".kd").text.strip()
                    plus_minus= row.select_one(".plus-minus").text.strip()
                    adr       = row.select_one(".adr").text.strip()
                    kast      = row.select_one(".kast").text.strip()
                    rating    = row.select_one(".rating").text.strip()

                    stats[key].append({
                        "team": team,
                        "player_id": player_id,
                        "nick": player_nick,
                        "k-d": kd,
                        "+/-": plus_minus,
                        "ADR": adr,
                        "KAST": kast,
                        "rating": rating,
                    })

                except Exception as e:
                    continue

    return stats

# ----------------------------------------------------------------------------
# Função Principal
# ----------------------------------------------------------------------------
def fetch_match_details(match_url: str) -> Dict:
    """Coleta vetos, mapas e estatísticas de uma partida HLTV."""
    html = _get_html(match_url)
    soup = BeautifulSoup(html, "html.parser")

    return {
        "vetos": get_vetos(soup),
        "maps": get_maps(soup),
        "player_stats": parse_player_stats(soup),
    }
