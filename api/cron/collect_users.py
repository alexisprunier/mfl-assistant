from bson import ObjectId
import datetime
import requests
import logging
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

    response = requests.get(
        url=base_url + str(offset)
    )

    if response.status_code == 200:
        users = response.json()

        if "users" in users:
            for u in users["users"]:
                if "walletAddress" in u:
                    player = await build_and_upsert_user(db, u)

            if len(users["users"]) >= 20:
                await upsert_vars(db, user_collection_offset_var, offset + 20 - 1)
            else:
                await upsert_vars(db, user_collection_offset_var, None)

