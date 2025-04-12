import datetime
import logging

logger = logging.getLogger("compute_club_count_per_day")
logger.setLevel(logging.INFO)

data_property = "founded_club_count"


async def main(db):

    # MongoDB aggregation pipeline to compute founded clubs per day
    pipeline = [
        {"$match": {"foundation_date": {"$ne": None}, "status": "FOUNDED"}},
        {"$project": {"date": {"$toDate": {"$toLong": "$foundation_date"}}}},
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$date"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]

    # Asynchronously fetch the cursor
    cursor = db.clubs.aggregate(pipeline)

    # Asynchronously iterate through the cursor
    foundation_per_day = [c async for c in cursor]

    if len(foundation_per_day) == 0:
        logger.critical("No clubs with foundation dates found.")
        return

    # Convert the list into a dictionary with date as the key
    first_day = foundation_per_day[0]["_id"]
    foundation_per_day = {c["_id"]: c["count"] for c in foundation_per_day}

    start_date = datetime.datetime.strptime(first_day, "%Y-%m-%d").date()
    end_date = datetime.datetime.now().date()
    current_date = start_date
    current_date_str = current_date.strftime("%Y-%m-%d")

    founded_clubs_per_day = {
        (current_date - datetime.timedelta(days=1)).strftime("%Y-%m-%d"): 0
    }

    # Compute the total clubs founded up to each date
    while current_date <= end_date:
        founded_clubs_per_day[current_date_str] = \
            founded_clubs_per_day[(current_date - datetime.timedelta(days=1)).strftime("%Y-%m-%d")] \
            + (foundation_per_day.get(current_date_str, 0))
        current_date += datetime.timedelta(days=1)
        current_date_str = current_date.strftime("%Y-%m-%d")

    # Prepare the data points to be inserted
    data_points = [{"property": data_property, "date": date, "value": count}
                   for date, count in founded_clubs_per_day.items()]

    # Delete existing data points and insert new ones asynchronously
    await db.data_points.delete_many({"property": data_property})
    await db.data_points.insert_many(data_points)

    logger.info(f"Successfully updated founded club counts per day from {start_date} to {end_date}.")