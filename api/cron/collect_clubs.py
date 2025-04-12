import httpx
import logging
from utils.db import upsert_vars, get_var_value, build_and_upsert_user, build_and_upsert_club

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/clubs/"
max_clubs_to_update = 5

last_treated_club_id_var = "last_treated_club_id"

logger = logging.getLogger("collect_clubs")
logger.setLevel(logging.INFO)

async def main(db):

    last_id = await get_var_value(db, last_treated_club_id_var)
    reset_var = False
    added_clubs = False

    if last_id is None:
        last_id = 0

    club_ids_to_fetch = [x for x in range(last_id + 1, last_id + 1 + max_clubs_to_update)]
    logger.critical(f"Club IDs to treat: {club_ids_to_fetch}")

    async with httpx.AsyncClient() as client:  # Use httpx AsyncClient for async HTTP requests
        for i in club_ids_to_fetch:
            try:
                response = await client.get(url=base_url + str(i))  # Asynchronous GET request
                logger.critical(f"collect_clubs: Response status: {response.status_code} with id {i}")

                if response.status_code == 200:
                    data = response.json()
                    user = None

                    if "ownedBy" in data and "walletAddress" in data["ownedBy"]:
                        user = await build_and_upsert_user(
                            db,
                            data["ownedBy"]
                        )

                    await build_and_upsert_club(db, data, user)
                
                if response.status_code == 404:
                    if not added_clubs:
                        club_ids_to_fetch.append(club_ids_to_fetch[-1] + 1)
                        added_clubs = True

                    if added_clubs and club_ids_to_fetch[-1] == i:
                        reset_var = True
                        break
            except httpx.RequestError as e:
                logger.error(f"Error fetching data for club id {i}: {e}")
                continue  # Move to the next club id if there’s an error

    if reset_var:
        await upsert_vars(db, last_treated_club_id_var, 0)
    else:
        if len(club_ids_to_fetch) > 0:
            await upsert_vars(db, last_treated_club_id_var, club_ids_to_fetch[-1])

async def _get_last_treated_club_id(db):
    last_treated_club_record = await db.vars.find_one({"var": last_treated_club_id_var})

    if last_treated_club_record:
        return last_treated_club_record["value"]

    return 0