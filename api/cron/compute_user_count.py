import datetime
import logging

logger = logging.getLogger("compute_user_count")
logger.setLevel(logging.INFO)

club_data_property = "club_owner_count"
player_data_property = "player_owner_count"


async def main(db):
    logger.critical("compute_user_count - Start")

    today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    club_count = len(await db.clubs.distinct('owner')) - 1
    player_count = len(await db.players.distinct('owner')) - 1

    logger.info(f"compute_user_count - Computed club owners: {club_count}, player owners: {player_count}")

    # Prepare records
    data_points = [
        {
            "property": club_data_property,
            "date": today,
            "value": club_count,
        },
        {
            "property": player_data_property,
            "date": today,
            "value": player_count,
        },
    ]

    for dp in data_points:
        await db.data_points.update_one(
            {"property": dp["property"], "date": dp["date"]},
            {"$set": {"value": dp["value"]}},
            upsert=True
        )
        logger.info(f"compute_user_count - Updated data_point: {dp['property']} = {dp['value']} on {today}")
