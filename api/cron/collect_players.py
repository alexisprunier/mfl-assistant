import datetime
import requests
import logging
from utils.db import get_var_value, upsert_vars, build_and_upsert_user, build_and_upsert_club, build_and_upsert_player, build_and_upsert_contract
from utils.date import convert_unix_to_datetime


base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players?limit=50&sorts=metadata.overall&sortsOrders=DESC"

last_treated_player_id_var = "last_treated_player_id"

logger = logging.getLogger("collect_players")
logger.setLevel(logging.INFO)


async def main(db):

    last_treated_player_id = await get_var_value(db, last_treated_player_id_var)
    logger.critical("collect_players: last id: " + str(last_treated_player_id))

    response = requests.get(
        url=base_url + ("" if last_treated_player_id is None else f"&beforePlayerId={last_treated_player_id}")
    )

    if response.status_code == 200:
        players = response.json()

        if len(players) > 0:
            for p in players:
                if "ownedBy" in p and "walletAddress" in p["ownedBy"]:
                    user = await build_and_upsert_user(
                        db,
                        p["ownedBy"]
                    )

                player = await build_and_upsert_player(db, p, user)

                if "activeContract" in p and "id" in p["activeContract"]:
                    if "club" in p["activeContract"]:
                        club = await build_and_upsert_club(
                            db,
                            p["activeContract"]["club"]
                        )

                    existing_contract = await db.contracts \
                        .find_one({"player": player["_id"]})

                    if existing_contract and existing_contract["_id"] != p["activeContract"]["id"]:
                        await db.contracts.delete_one({"player": player["_id"]})

                    user = await build_and_upsert_contract(
                        db,
                        p["activeContract"],
                        player,
                        club
                    )
                else:
                    await db.contracts.delete_one({"player": player["_id"]})


            await upsert_vars(db, last_treated_player_id_var, players[-1]["id"])
        else:
            await upsert_vars(db, last_treated_player_id_var, None)
