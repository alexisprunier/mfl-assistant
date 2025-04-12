from collections import defaultdict
from datetime import datetime, timedelta
from math import exp
import logging
from bson import ObjectId

logger = logging.getLogger("compute_raw_player_pricings")
logger.setLevel(logging.INFO)


async def main(db):
    logger.critical("Start compute_raw_player_pricings")
    pipeline = [
        {
            "$lookup": {
                "from": "raw_player_pricings",
                "localField": "_id",
                "foreignField": "sale",
                "as": "matching_sales"
            }
        },
        {
            "$match": {
                "matching_sales": {"$size": 0},
                "club": {"$exists": False}
            }
        }
    ]

    sales = await db.sales.aggregate(pipeline).to_list(length=None)

    for s in sales:
        if "overall" not in s:
            continue

        price = await calculate_price_from_sale(db, s)

        if price is None:
            continue
        
        data_point = {
            "overall": s["overall"],
            "position": s["positions"][0],
            "age": s["age"],
            "date": s["execution_date"],
            "price": price,
            "sale": s["_id"]
        }
        
        existing_entry = await db.raw_player_pricings.find_one({
            "overall": s["overall"],
            "position": s["positions"][0],
            "age": s["age"],
            "date": s["execution_date"]
        })
        
        if existing_entry:
            await db.raw_player_pricings.update_one(
                {"_id": existing_entry["_id"]},
                {"$set": {"price": price}}
            )
        else:
            await db.raw_player_pricings.insert_one(data_point)


async def calculate_price_from_sale(db, sale, lookback_days=30):
    target_date = sale["execution_date"]
    lookback_date = target_date - timedelta(days=lookback_days)
    
    threshold_mapping = {65: (65, 66), 75: (75, 76), 85: (85, 86),
                         64: (63, 64), 74: (73, 74), 84: (83, 84)}

    if sale["overall"] in threshold_mapping:
        overall_range = threshold_mapping[sale["overall"]]
    else:
        overall_range = (sale["overall"] - 1, sale["overall"] + 1)

    age_range = (sale["age"] - 1, sale["age"] + 1)

    sales = await db.sales.find({
        "execution_date": {"$gte": lookback_date, "$lte": sale["execution_date"]},
        "overall": {"$gte": overall_range[0], "$lte": overall_range[1]},
        "age": {"$gte": age_range[0], "$lte": age_range[1]},
        "positions.0": sale["positions"][0]
    }).to_list(length=None)
    
    relevant_prices_dates = [(sale["price"], sale["execution_date"]) for sale in sales]
    
    if not relevant_prices_dates:
        return None
    
    return await exponential_smoothing(relevant_prices_dates)


async def exponential_smoothing(prices_dates, half_life_days=15):
    now = datetime.now()
    weights = []
    weighted_prices = []
    
    for price, date in prices_dates:
        age_days = (now - date).days
        weight = exp(-age_days / half_life_days) 
        weights.append(weight)
        weighted_prices.append(price * weight)
    
    if weights:
        return sum(weighted_prices) / sum(weights)
    else:
        return None