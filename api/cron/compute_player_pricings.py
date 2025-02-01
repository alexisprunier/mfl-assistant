from collections import defaultdict
from datetime import datetime, timedelta
from math import exp
from pymongo import MongoClient
import json
import time
import logging
from bson import ObjectId

logger = logging.getLogger("compute_player_pricings")
logger.setLevel(logging.INFO)


async def main(db):
    logger.critical("Start compute_player_pricings")
    positions = [
        "GK", "RB", "LB", "CB", "RWB", "LWB", 
        "CDM", "RM", "LM", "CM", "CAM", "RW", 
        "LW", "CF", "ST"
    ]

    for p in positions:
        await get_smoothed_prices(db, datetime.now(), position=p)


async def get_smoothed_prices(db, target_date, position="ST"):
    # Define age and OVR ranges
    min_age, max_age = 16, 42
    min_ovr, max_ovr = 37, 99
    lookback_date = target_date - timedelta(days=30)

    pipeline = [
        {"$match": {
            "position": position,
            "date": {"$gte": lookback_date, "$lte": target_date}
        }},
        {"$sort": {"date": -1}},
        {"$group": {
            "_id": {"age": "$age", "ovr": "$overall"},
            "price": {"$first": "$price"},
        }},
    ]
    raw_prices = await db.raw_player_pricings.aggregate(pipeline).to_list(length=None)
    logger.critical(raw_prices)

    prices = {age: {ovr: None for ovr in range(min_ovr, max_ovr + 1)} for age in range(min_age, max_age + 1)}

    for entry in raw_prices:
        age, ovr, price = entry["_id"]["age"], entry["_id"]["ovr"], entry["price"]
        if min_age <= age <= max_age and min_ovr <= ovr <= max_ovr:
            prices[age][ovr] = price

    # Step 2: Interpolate missing values
    def get_neighbors(age, ovr):
        neighbors = []
        if age > min_age and prices[age - 1][ovr] is not None:
            neighbors.append(prices[age - 1][ovr])
        if ovr > min_ovr and prices[age][ovr - 1] is not None:
            neighbors.append(prices[age][ovr - 1])
        return neighbors

    for age in range(min_age, max_age + 1):
        for ovr in range(min_ovr, max_ovr + 1):
            if prices[age][ovr] is None:
                neighbors = get_neighbors(age, ovr)
                if neighbors:
                    prices[age][ovr] = sum(neighbors) / len(neighbors)

    # Step 3: Apply constraints (Multiple passes)
    for _ in range(5):
        for age in range(min_age + 1, max_age + 1):
            for ovr in range(min_ovr, max_ovr + 1):
                if prices[age][ovr] is not None and prices[age - 1][ovr] is not None:
                    prices[age][ovr] = min(prices[age][ovr], prices[age - 1][ovr])

        for age in range(min_age, max_age + 1):
            for ovr in range(min_ovr + 1, max_ovr + 1):
                if prices[age][ovr] is not None and prices[age][ovr - 1] is not None:
                    prices[age][ovr] = min(prices[age][ovr], prices[age][ovr - 1])

    # Step 4: Perform the upsert for each value
    for age in range(min_age, max_age + 1):
        for ovr in range(min_ovr, max_ovr + 1):
            if prices[age][ovr] is not None:
                price = 1 if round(prices[age][ovr]) < 1 else round(prices[age][ovr])
                await upsert_player_pricing(db, overall=ovr, position=position, age=age, price=price)


async def upsert_player_pricing(db, overall, position, age, price):
    filter_query = {
        "overall": overall,
        "position": position,
        "age": age
    }
    
    update_data = {
        "$set": {
            "price": price,
        }
    }
    
    await db.player_pricings.update_one(filter_query, update_data, upsert=True)
