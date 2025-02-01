from collections import defaultdict
from datetime import datetime, timedelta
from math import exp
from pymongo import MongoClient
import json
import time
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
                "matching_sales": {"$size": 0}
            }
        }
    ]

    sales = await db.sales \
        .aggregate(pipeline) \
        .to_list(length=None)

    for s in sales:
        logger.critical(s)
        logger.critical("TREAT SALE")
        logger.critical(json.dumps(s, sort_keys=True, indent=2, default=str))

        price = await calculate_price_from_sale(db, s)
        logger.warning(f"PRICE: {price}")

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
            logger.warning(f"EXISTING DATAPOINT: {data_point}")
            await db.raw_player_pricings.update_one(
                {"_id": existing_entry["_id"]},
                {"$set": {"price": price}}
            )
        else:
            logger.warning(f"DATAPOINT: {data_point}")
            db.raw_player_pricings.insert_one(data_point)


async def calculate_price_from_sale(db, sale, alpha=0.7, lookback_days=30):
    target_date = sale["execution_date"]
    lookback_date = target_date - timedelta(days=lookback_days)
    
    sales = await db.sales.find({
        "execution_date": {"$gte": lookback_date, "$lte": sale["execution_date"]},
        "overall": sale["overall"],
        "age": sale["age"],
        "positions": sale["positions"][0]
    }).to_list(length=None)

    logger.warning("RELATED SALES")
    logger.warning(json.dumps(sales, sort_keys=True, indent=2, default=str))
    
    relevant_prices_dates = [(sale["price"], sale["execution_date"]) for sale in sales]
    
    if not relevant_prices_dates:
        return None
    
    return exponential_smoothing(relevant_prices_dates, alpha)


def exponential_smoothing(prices_dates, alpha=0.7, beta=0.1):
    if not prices_dates:
        return None
    
    prices_dates.sort(key=lambda x: x[1])
    now = datetime.utcnow()
    smoothed_price = prices_dates[0][0]
    
    for price, date in prices_dates[1:]:
        days_diff = (now - date).days + 1
        weight = exp(-beta * days_diff)
        smoothed_price = alpha * price * weight + (1 - alpha) * smoothed_price
    
    return smoothed_price