import httpx
import logging
from utils.db import get_var_value, upsert_vars, build_and_upsert_match, build_and_upsert_club, build_and_upsert_user
from utils.date import convert_unix_to_datetime
import time

last_matches_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/matches?live=true&past=true&limit=12"
base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/matches/"

min_match_id_stepping = 1
max_match_id_stepping = 10

logger = logging.getLogger("collect_matches")
logger.setLevel(logging.INFO)

async def main(db):
    async with httpx.AsyncClient() as client:
        # Get last match id
        try:
            response = await client.get(url=last_matches_url)
            last_match_id = response.json()[0]["id"]
        except httpx.RequestError as e:
            logger.error(f"Error fetching last match id: {e}")
            return

        last_stored_match_id = await db.matches.find_one(sort=[("_id", -1)])

        if last_stored_match_id is None:
            last_stored_match_id = last_match_id - 100
        else:
            last_stored_match_id = last_stored_match_id["_id"]

        # Treat the new ones
        last_stored_match_id += 1
        treated_match_count = 0

        while treated_match_count < max_match_id_stepping:
            logger.critical("collect_matches: Treat match number: " + str(last_stored_match_id))

            try:
                response = await client.get(
                    url=base_url + str(last_stored_match_id) + "?withFormations=true"
                )

                if response.status_code == 200:
                    raw_match_data = response.json()
                    raw_match_data["id"] = last_stored_match_id

                    if raw_match_data["status"] != "ENDED":
                        logger.critical("collect_matches: crossed non ENDED match: " + str(last_stored_match_id))
                        last_stored_match_id += 1
                        await _treat_match(db, raw_match_data)
                        if last_match_id - last_stored_match_id < 1000:
                            break
                    else:
                        await _treat_match(db, raw_match_data)
                        last_stored_match_id += 1
                        treated_match_count += 1
                elif response.status_code == 404:
                    logger.critical("collect_matches: 404 found for: " + str(last_stored_match_id))
                    last_stored_match_id += 1
            except httpx.RequestError as e:
                logger.error(f"Error fetching match data for {last_stored_match_id}: {e}")
                break

        # Treat the old ones
        min_stored_match_id = await db.matches.find_one(sort=[('_id', 1)])
        treated = 0

        if min_stored_match_id is not None:
            min_stored_match_id = min_stored_match_id["_id"] - 1

            while treated < min_match_id_stepping:
                logger.critical("collect_matches: Treat old match number: " + str(min_stored_match_id))
                try:
                    response = await client.get(
                        url=base_url + str(min_stored_match_id) + "?withFormations=true"
                    )

                    if response.status_code == 200:
                        raw_match_data = response.json()
                        raw_match_data["id"] = min_stored_match_id

                        await _treat_match(db, raw_match_data)
                        treated += 1

                    min_stored_match_id = min_stored_match_id - 1
                except httpx.RequestError as e:
                    logger.error(f"Error fetching old match data for {min_stored_match_id}: {e}")
                    break

async def _treat_match(db, mfl_match):
    home_user = await build_and_upsert_user(db, {"address": mfl_match["homeCoachWalletAddress"]})
    away_user = await build_and_upsert_user(db, {"address": mfl_match["awayCoachWalletAddress"]})
    home_club = await build_and_upsert_club(db, {"_id": mfl_match["homeSquad"]["club"]["id"]}) if "homeSquad" in mfl_match else None
    away_club = await build_and_upsert_club(db, {"_id": mfl_match["awaySquad"]["club"]["id"]}) if "awaySquad" in mfl_match else None
    return await build_and_upsert_match(db, mfl_match, home_user, away_user, home_club, away_club)