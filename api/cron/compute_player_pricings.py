from collections import defaultdict
from datetime import datetime, timedelta, time as dt_time
from math import exp
from pymongo import MongoClient
import json
import time
import logging
from bson import ObjectId
import numpy as np
import scipy.optimize as opt
from scipy.interpolate import RectBivariateSpline
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel as C, RationalQuadratic
from scipy.optimize import minimize


logger = logging.getLogger("compute_player_pricings")
logger.setLevel(logging.INFO)


async def main(db):
    logger.critical("Start compute_player_pricings")

    dt = datetime.now()

    positions = [
        "GK", "RB", "LB", "CB", "RWB", "LWB", 
        "CDM", "RM", "LM", "CM", "CAM", "RW", 
        "LW", "CF", "ST"
    ]

    for p in positions:
        await get_smoothed_prices(db, dt, position=p)
    logger.critical("End compute_player_pricings")


async def get_smoothed_prices(db, target_date, position="ST"):
    target_date = datetime.combine(target_date.date(), dt_time(23, 59, 59))
    lookback_date = target_date - timedelta(days=30)
    lookback_date = datetime.combine(lookback_date, dt_time.min)

    pipeline = [
        {"$match": {
            "position": position,
            "date": {"$gte": lookback_date, "$lte": target_date}
        }},
        {"$sort": {"date": -1}},
        {"$group": {
            "_id": {"age": "$age", "overall": "$overall"},
            "price": {"$first": "$price"},
        }},
    ]
    raw_prices = await db.raw_player_pricings.aggregate(pipeline).to_list(length=None)

    boundary_points = [(43, ovr, 1) for ovr in np.arange(37, 100)]
    
    import scipy.interpolate as spi
    from sklearn.ensemble import RandomForestRegressor

    known_points = [(d["_id"]["age"], d["_id"]["overall"]) for d in raw_prices]  
    known_prices = [d["price"] for d in raw_prices]  

    X = np.array(known_points)  # Features : (âge, overall)
    y = np.array(known_prices)  # Target : prix

    # 🌟 1. Interpolation linéaire
    interp = spi.LinearNDInterpolator(X, y)

    # 🌟 2. Modèle de régression pour estimer les valeurs manquantes
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 🌟 3. Générer la grille complète (âge : 16 à 42, overall : 37 à 99)
    ages = np.arange(16, 43)  # 16 à 42 inclus
    overalls = np.arange(37, 100)  # 37 à 99 inclus
    grid = [(age, overall) for age in ages for overall in overalls]

    # Stocker les prix estimés
    predicted_prices = []
    for age, overall in grid:
        interp_price = interp(age, overall)  # Interpolation
        if np.isnan(interp_price):  # Si l'interpolation échoue, utiliser le modèle
            interp_price = model.predict([[age, overall]])[0]
        interp_price = int(round(interp_price.item() if isinstance(interp_price, np.ndarray) else interp_price))
        interp_price = 1 if interp_price < 1 else interp_price
        await upsert_player_pricing(db, overall=int(overall), position=position, age=int(age), price=interp_price, date=target_date)


async def upsert_player_pricing(db, overall, position, age, price, date):
    filter_query = {
        "overall": overall,
        "position": position,
        "age": age,
        "date": date
    }
    
    update_data = {
        "$set": {
            "price": price,
        }
    }
    
    await db.player_pricings.update_one(filter_query, update_data, upsert=True)
