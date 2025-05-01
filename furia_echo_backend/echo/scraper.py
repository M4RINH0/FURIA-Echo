import datetime as dt
import re
from typing import List, Dict

import cloudscraper
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

# --------------------------------------------------------------------------
# CONFIGURAÇÕES
# --------------------------------------------------------------------------
TEAM_ID   = 8297          # id FURIA = 8297  | 4869 = ENCE
TEAM_SLUG = "furia"

URL = f"https://www.hltv.org/team/{TEAM_ID}/{TEAM_SLUG}"

# --------------------------------------------------------------------------
# HELPERS
# --------------------------------------------------------------------------
_scraper = cloudscraper.create_scraper(
    delay=1,
    browser={"custom": f"{UserAgent().random} (FuriaEcho)"}
)

def _get_page_html() -> str:
    r = _scraper.get(URL, timeout=15)
    r.raise_for_status()
    return r.text

def _ts(ms: int | str) -> dt.datetime:
    "timestamp -> datetime UTC (aware)"
    return dt.datetime.utcfromtimestamp(int(ms) / 1000).replace(tzinfo=dt.timezone.utc)

# --------------------------------------------------------------------------
# PARSER • PROXIMOS CAMPEONATOS
# --------------------------------------------------------------------------
def parse_upcoming_events(soup: BeautifulSoup) -> List[Dict]:
    """
    Lê a aba ‘Ongoing & upcoming events’ do eventsBox.
    Retorna lista ordenada pela data de início.
    """
    ev_box = soup.find("div", id="eventsBox")
    if not ev_box:
        return []

    ongo_div = ev_box.find("div", id="ongoingEvents")
    if not ongo_div:
        return []

    holder = ongo_div.find("div", class_="upcoming-events-holder")
    if not holder:
        return []

    events: List[Dict] = []

    for anchor in holder.select("a.ongoing-event"):
        try:
            url_path   = anchor["href"]
            event_url  = f"https://www.hltv.org{url_path}"
            event_id   = int(url_path.split("/")[2])
            logo_img   = anchor.select_one(".eventbox-eventlogo img")
            logo_url   = logo_img["src"] if logo_img else ""

            name_div   = anchor.select_one(".eventbox-eventname")
            event_name = name_div.text.strip() if name_div else "Unnamed event"

            date_spans = anchor.select(".eventbox-date span[data-unix]")
            start_ms, end_ms = (int(s["data-unix"]) for s in date_spans[:2])
            start_iso = _ts(start_ms).isoformat()
            end_iso   = _ts(end_ms).isoformat()

            events.append({
                "hltv_id":   event_id,
                "name":      event_name,
                "start_utc": start_iso,
                "end_utc":   end_iso,
                "event_url": event_url,
                "logo":      logo_url,
            })
        except Exception:
            # Em caso de markup inesperado, passa para o próximo
            continue

    # ordena por data de início
    return sorted(events, key=lambda e: e["start_utc"])

# --------------------------------------------------------------------------
# PARSER • PROXIMAS PARTIDAS
# --------------------------------------------------------------------------
def parse_upcoming_matches(soup: BeautifulSoup) -> List[Dict]:
    box = soup.find("div", id="matchesBox")
    if not box:
        return []

    upcoming, current_event = [], "Unknown event"

    # pega o <h2> “Upcoming matches …”
    h2_up = box.find("h2", string=re.compile(r"Upcoming matches", re.I))
    if not h2_up:
        return upcoming

    # ⚡ Verifica se há "empty-state" logo depois
    empty = h2_up.find_next_sibling("div", class_="empty-state")
    if empty:
        # Não tem partidas futuras
        return upcoming

    # Senão, prossiga para pegar a tabela
    table = h2_up.find_next("table", class_="match-table")
    if not table:
        return upcoming

    for node in table.children:
        if node.name == "thead" and node.find("tr", class_="event-header-cell"):
            link = node.find("a")
            current_event = link.text.strip() if link else "Unknown event"
            continue

        if node.name != "tbody":
            continue

        trs = node.find_all("tr", class_="team-row")
        for tr in trs:
            ts_ms  = int(tr.select_one(".date-cell span[data-unix]")["data-unix"])
            utc_dt = _ts(ts_ms)

            # aqui não precisa mais validar data, só pega mesmo
            utc_dt_iso = utc_dt.isoformat()

            team1 = tr.select_one(".team-name.team-1").text.strip()
            team2 = tr.select_one(".team-name.team-2").text.strip()

            anchor = tr.select_one(
                "td.matchpage-button-cell a, td.stats-button-cell a, a.matchpage-button"
            )
            if anchor:
                match_url = f"https://www.hltv.org{anchor['href']}"
                match_id  = int(anchor["href"].split("/")[2])
            else:
                match_url = ""
                match_id  = -ts_ms

            upcoming.append({
                "hltv_id":      match_id,
                "event":        current_event,
                "datetime_utc": utc_dt_iso,
                "team1":        team1,
                "team2":        team2,
                "opponent":     team2 if team1.lower() == TEAM_SLUG else team1,
                "match_url":    match_url,
            })

    return upcoming

# --------------------------------------------------------------------------
# PARSER • RESULTADOS RECENTES
# --------------------------------------------------------------------------
def parse_recent_results(soup: BeautifulSoup) -> List[Dict]:
    box = soup.find("div", id="matchesBox")
    if not box:
        return []

    h2_res = box.find("h2", string=re.compile(r"Recent results", re.I))
    if not h2_res:
        return []

    table = h2_res.find_next("table", class_="match-table")
    if not table:
        return []

    results, current_event = [], "Unknown event"

    for node in table.children:
        if node.name == "thead" and node.find("tr", class_="event-header-cell"):
            link = node.find("a")
            current_event = link.text.strip() if link else "Unknown event"
            continue

        if node.name != "tbody":
            continue

        trs = node.find_all("tr", class_="team-row")
        for tr in trs:
            if not tr:
                continue

            ts_ms  = int(tr.select_one(".date-cell span[data-unix]")["data-unix"])
            utc_dt = _ts(ts_ms).isoformat()

            team1 = tr.select_one(".team-name.team-1").text.strip()
            team2 = tr.select_one(".team-name.team-2").text.strip()

            scores = tr.select(".score")
            if len(scores) >= 2:
                team1_score = scores[0].text.strip()
                team2_score = scores[-1].text.strip()
                score_str   = f"{team1_score}-{team2_score}"
                win_flag    = "lost" not in scores[0].get("class", [])
            else:
                score_str = "-"
                win_flag  = None

            anchor = tr.select_one("td.stats-button-cell a, a.stats-button")
            match_url = f"https://www.hltv.org{anchor['href']}" if anchor else ""
            match_id  = int(anchor["href"].split("/")[2]) if anchor else -ts_ms

            results.append({
                "hltv_id":      match_id,
                "event":        current_event,
                "datetime_utc": utc_dt,
                "opponent":     team2 if team1.lower() == TEAM_SLUG else team1,
                "score":        score_str,
                "win":          win_flag,
                "match_url":    match_url,
            })

    return results

# --------------------------------------------------------------------------
# PARSER • RANKING
# --------------------------------------------------------------------------
def parse_ranking(soup: BeautifulSoup) -> Dict:
    box = soup.find("div", class_="profile-team-stat")
    if not box:
        return {}
    rank = int(box.select_one("span").text.replace("#", ""))
    pts  = int(re.search(r"\d+", box.text.split("points")[0]).group())
    return {"current_rank": rank, "points": pts}

# --------------------------------------------------------------------------
# ENTRADA ÚNICA
# --------------------------------------------------------------------------
def fetch_team_snapshot() -> Dict:
    html = _get_page_html()
    soup = BeautifulSoup(html, "html.parser")

    return {
        "team_id": TEAM_ID,
        "team_name": TEAM_SLUG.upper(),
        "last_updated": dt.datetime.utcnow().isoformat() + "Z",
        "ranking": parse_ranking(soup),
        "upcoming_matches": parse_upcoming_matches(soup),
        "recent_results": parse_recent_results(soup),
        "upcoming_events":  parse_upcoming_events(soup),
    }
