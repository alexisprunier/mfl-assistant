import logging
import httpx
from utils.db import upsert_vars, get_var_value, build_and_upsert_user, build_and_upsert_club

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/leaderboards/users/global?sort=nbMflPoints&sortOrder=DESC&limit=20&offset="

user_collection_offset_var = "user_collection_offset"

logger = logging.getLogger("collect_users")
logger.setLevel(logging.INFO)


async def main(db):

    offset = await get_var_value(db, user_collection_offset_var)

    if offset is None:
        offset = 0

    logger.critical(f"user_collection_offset: {offset}")

    # Use httpx.AsyncClient() to make asynchronous requests
    async with httpx.AsyncClient() as client:
        try:
            # Make the asynchronous GET request
            response = await client.get(url=base_url + str(offset))

            if response.status_code == 200:
                users = response.json()

                if "users" in users:
                    for u in users["users"]:
                        if "walletAddress" in u:
                            await build_and_upsert_user(db, u)

                    # Update the offset in the database after processing users
                    if len(users["users"]) >= 20:
                        await upsert_vars(db, user_collection_offset_var, offset + 20)
                    else:
                        await upsert_vars(db, user_collection_offset_var, None)

        except httpx.RequestError as e:
            logger.error(f"Error making request to the API: {e}")