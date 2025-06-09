import httpx
import logging
from utils.db import get_var_value, upsert_vars, build_and_upsert_match, build_and_upsert_club, build_and_upsert_user
from utils.date import convert_unix_to_datetime
import time
from datetime import datetime, timedelta

last_matches_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/matches?live=true&past=true&limit=12"
base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/matches/"

min_match_id_stepping = 0
max_match_id_stepping = 5
max_live_match_to_treat = 5

logger = logging.getLogger("collect_matches")
logger.setLevel(logging.INFO)

async def treat_new_matches(db, client, last_match_id):

    last_stored_match = await db.matches.find_one(sort=[("_id", -1)])
    last_stored_match_id = last_stored_match["_id"] if last_stored_match else last_match_id

    treated_match_count = 0
    last_stored_match_id += 1

    while treated_match_count < max_match_id_stepping and last_stored_match_id <= last_match_id:
        logger.critical(f"collect_matches: Treat match number: {last_stored_match_id}")

        try:
            response = await client.get(
                url=base_url + str(last_stored_match_id) + "?withFormations=true"
            )

            if response.status_code == 200:
                raw_match_data = response.json()
                raw_match_data["id"] = last_stored_match_id
                await _treat_match(db, raw_match_data)
                last_stored_match_id += 1
                treated_match_count += 1  
            elif response.status_code == 404:
                logger.critical(f"collect_matches: 404 found for: {last_stored_match_id}")
                last_stored_match_id += 1

        except httpx.RequestError as e:
            logger.error(f"collect_matches: Error fetching match data for {last_stored_match_id}: {e}")
            break

async def treat_old_matches(db, client):
    min_stored_match_id = await db.matches.find_one(sort=[('_id', 1)])
    treated = 0

    if min_stored_match_id is not None:
        min_stored_match_id = min_stored_match_id["_id"] - 1

        while treated < min_match_id_stepping:
            logger.critical(f"collect_matches: Treat old match number: {min_stored_match_id}")
            try:
                response = await client.get(
                    url=base_url + str(min_stored_match_id) + "?withFormations=true"
                )

                if response.status_code == 200:
                    raw_match_data = response.json()
                    raw_match_data["id"] = min_stored_match_id
                    await _treat_match(db, raw_match_data)
                    treated += 1

                min_stored_match_id -= 1
            except httpx.RequestError as e:
                logger.error(f"collect_matches: Error fetching old match data for {min_stored_match_id}: {e}")
                break

async def treat_live_matches(db, client):
    cutoff = datetime.utcnow() - timedelta(minutes=12)

    live_matches_cursor = db.matches.find(
        {
            "startDate": {"$lte": cutoff.isoformat()},
            "status": "LIVE"
        }
    ).sort("startDate", -1).limit(max_live_match_to_treat)

    matches_to_treat = await live_matches_cursor.to_list(length=max_live_match_to_treat)

    for match in matches_to_treat:
        match_id = match["_id"]
        logger.critical(f"collect_matches: Treat live match number: {match_id}")
        try:
            response = await client.get(
                url=base_url + str(match_id) + "?withFormations=true"
            )
            if response.status_code == 200:
                raw_match_data = response.json()
                raw_match_data["id"] = match_id
                await _treat_match(db, raw_match_data)
            else:
                logger.warning(f"collect_matches: Failed to fetch live match {match_id}: HTTP {response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"collect_matches: Error fetching live match data for {match_id}: {e}")

async def main(db):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url=last_matches_url)
            last_match_id = response.json()[0]["id"]
        except httpx.RequestError as e:
            logger.error(f"collect_matches: Error fetching last match id: {e}")
            return

        await treat_new_matches(db, client, last_match_id)
        await treat_old_matches(db, client)
        await treat_live_matches(db, client)

async def _treat_match(db, mfl_match):
    home_user = await build_and_upsert_user(db, {"address": mfl_match["homeCoachWalletAddress"]})
    away_user = await build_and_upsert_user(db, {"address": mfl_match["awayCoachWalletAddress"]})
    home_club = await build_and_upsert_club(db, {"id": mfl_match["homeSquad"]["club"]["id"]}) if "homeSquad" in mfl_match else None
    away_club = await build_and_upsert_club(db, {"id": mfl_match["awaySquad"]["club"]["id"]}) if "awaySquad" in mfl_match else None
    return await build_and_upsert_match(db, mfl_match, home_user, away_user, home_club, away_club)