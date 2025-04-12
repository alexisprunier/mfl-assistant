import datetime
import logging
from utils.data_point import fill_missing_intervals

logger = logging.getLogger("compute_sale_total")
logger.setLevel(logging.INFO)

player_sale_total_property = {
    "h": "player_sale_total_per_hour",
    "d": "player_sale_total_per_day",
    "w": "player_sale_total_per_week",
    "m": "player_sale_total_per_month",
}

club_sale_total_property = {
    "h": "club_sale_total_per_hour",
    "d": "club_sale_total_per_day",
    "w": "club_sale_total_per_week",
    "m": "club_sale_total_per_month",
}

sale_total_property = {
    "h": "sale_total_per_hour",
    "d": "sale_total_per_day",
    "w": "sale_total_per_week",
    "m": "sale_total_per_month",
}


async def main(db):
    # Loop through each time unit ('h', 'd', 'm') and process the data.
    for i in ["h", "d", "m"]:
        # Player sales aggregation and insertion
        pipeline = [
            {"$match": {"player": {"$exists": True, "$ne": None}}},
            {"$group": _get_time_unit_group_id(i)},
            {"$sort": {"_id": 1}}
        ]
        await _insert_and_replace_data_points(db, pipeline, player_sale_total_property[i], i)

        # Club sales aggregation and insertion
        pipeline = [
            {"$match": {"club": {"$exists": True, "$ne": None}}},
            {"$group": _get_time_unit_group_id(i)},
            {"$sort": {"_id": 1}}
        ]
        await _insert_and_replace_data_points(db, pipeline, club_sale_total_property[i], i)

        # General sales aggregation and insertion
        pipeline = [
            {"$group": _get_time_unit_group_id(i)},
            {"$sort": {"_id": 1}}
        ]
        await _insert_and_replace_data_points(db, pipeline, sale_total_property[i], i)


async def _insert_and_replace_data_points(db, pipeline, property, interval):
    # Aggregate data based on the pipeline.
    total_per_date = [c async for c in db.sales.aggregate(pipeline)]

    # Prepare data points with the aggregated values.
    data_points = [{"property": property, "date": r["_id"], "value": r["total"]} for r in total_per_date]

    # Fill in any missing intervals for the data points.
    data_points = fill_missing_intervals(data_points, interval, property)

    # Delete existing data points for the given property.
    await db.data_points.delete_many({"property": property})

    # Insert the new calculated data points.
    if data_points:
        await db.data_points.insert_many(data_points)


def _get_time_unit_group_id(time_unit):
    # Return the appropriate MongoDB aggregation pipeline group definition based on the time unit.
    if time_unit == "h":
        return {
            "_id": {"$dateToString": {"format": "%Y-%m-%d %H:00", "date": {"$toDate": "$execution_date"}}},
            "total": {"$sum": "$price"}
        }
    elif time_unit == "d":
        return {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$toDate": "$execution_date"}}},
            "total": {"$sum": "$price"}
        }
    elif time_unit == "w":
        return {
            "year": {"$isoWeekYear": {"$toDate": "$execution_date"}},
            "week": {"$isoWeek": {"$toDate": "$execution_date"}},
            "total": {"$sum": "$price"}
        }
    elif time_unit == "m":
        return {
            "_id": {"$dateToString": {"format": "%Y-%m", "date": {"$toDate": "$execution_date"}}},
            "total": {"$sum": "$price"}
        }
    else:
        raise ValueError("Invalid time unit. Choose 'h', 'd', 'w', or 'm'.")