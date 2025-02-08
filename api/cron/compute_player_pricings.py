from collections import defaultdict
from datetime import datetime, timedelta
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
    positions = [
        "GK", "RB", "LB", "CB", "RWB", "LWB", 
        "CDM", "RM", "LM", "CM", "CAM", "RW", 
        "LW", "CF", "ST"
    ]

    for p in positions:
        await get_smoothed_prices(db, datetime.now(), position=p)
    logger.critical("End compute_player_pricings")


"""async def get_smoothed_prices(db, target_date, position="ST"):
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
                await upsert_player_pricing(db, overall=ovr, position=position, age=age, price=price)"""

async def get_smoothed_prices(db, target_date, position="ST"):
    lookback_date = target_date - timedelta(days=30)

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
    #raw_prices += [{"_id": {"age": age, "overall": overall}, "price": price} for age, overall, price in boundary_points]

    """known_points = [(d["_id"]["age"], d["_id"]["overall"]) for d in raw_prices]
    known_prices = [d["price"] for d in raw_prices]

    ages = np.arange(16, 43)
    overalls = np.arange(37, 100)

    ages_known = np.array([p[0] for p in known_points])
    overalls_known = np.array([p[1] for p in known_points])
    prices_known = np.array(known_prices)

    def price_function(x, A, B, C, D, E, F):
        age, overall = x
        # Modified model to control price escalation
        return A * np.exp(B * age) + C * np.exp(D * overall) + E * (age ** 2) + F * (overall ** 2)

    params, _ = opt.curve_fit(price_function, (ages_known, overalls_known), prices_known, maxfev=10000)"""

    """🌟🌟🌟# === Step 1: Simulated Known Data (Replace with your actual data) ===
    # Age range: 16 to 42, Overall range: 37 to 99
    known_points = [(d["_id"]["age"], d["_id"]["overall"]) for d in raw_prices]  # (age, overall) pairs
    known_prices = [d["price"] for d in raw_prices]  # Corresponding prices

    # Add all (age, 36) pairs with price 1
    for age in range(16, 44):  # 16 to 43 inclusive
        known_points.append((age, 36))
        known_prices.append(1)

    # Add all (43, overall) pairs with price 1
    for overall in range(37, 100):  # 37 to 99 inclusive
        known_points.append((43, overall))
        known_prices.append(1)

    # Define the full grid of (age, overall) to fill
    ages = np.arange(16, 44) # ages = np.arange(16, 43)  # Age range 16 to 42
    overalls = np.arange(36, 100) # overalls = np.arange(37, 100)  # Overall range 37 to 99

    # Create all possible (age, overall) pairs
    grid_x, grid_y = np.meshgrid(ages, overalls, indexing="ij")

    # Define a function that respects the monotonicity constraints
    def price_function(X, a, b, c, d):
        age, overall = X
        return a * np.exp(-b * (age - 16)) + c * (overall - 36) ** d # (overall - 37) ** d  # Exponential decay for age, power increase for overall

    # Fit the function to known data
    X_data = np.array(known_points).T  # (2, N) shape for fitting
    y_data = np.array(known_prices)

    # Initial guess for parameters
    initial_guess = [1, 0.03, 0.02, 2]  # (a, b, c, d)

    # Fit model
    params, _ = opt.curve_fit(price_function, X_data, y_data, p0=initial_guess, maxfev=10000)"""

    #🌟🌟🌟 === Step 1: Simulated Known Data (Replace with your actual data) ===
    # Age range: 16 to 42, Overall range: 37 to 99
    """known_points = [(d["_id"]["age"], d["_id"]["overall"]) for d in raw_prices]  # (age, overall) pairs
    known_prices = [d["price"] for d in raw_prices]  # Corresponding prices

    logger.critical(known_points, known_prices)

    # Define the full grid of (age, overall) to fill
    ages = np.arange(16, 43)  # Age range 16 to 42
    overalls = np.arange(37, 100)  # Overall range 37 to 99

    # Create all possible (age, overall) pairs
    grid_x, grid_y = np.meshgrid(ages, overalls, indexing="ij")

    # Define a function that respects the monotonicity constraints
    def price_function(X, a, b, c, d):
        age, overall = X
        return a * np.exp(-b * (age - 16)) + c * (overall - 37) ** d  # Exponential decay for age, power increase for overall

    # Fit the function to known data
    X_data = np.array(known_points).T  # (2, N) shape for fitting
    y_data = np.array(known_prices)

    # Initial guess for parameters
    initial_guess = [2, 0.05, 0.03, 3]  # (a, b, c, d)

    # Fit model
    params, _ = opt.curve_fit(price_function, X_data, y_data, p0=initial_guess, maxfev=10000)

    for x, age in enumerate(list(ages)):
        for y, overall in enumerate(list(overalls)):
            predicted_price = int(round(price_function((age, overall), *params)))
            predicted_price = 1 if predicted_price < 1 else predicted_price
            await upsert_player_pricing(db, overall=int(overall), position=position, age=int(age), price=predicted_price)"""

    # 🌟🌟🌟Convertir en tableaux numpy pour le traitement
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
        await upsert_player_pricing(db, overall=int(overall), position=position, age=int(age), price=interp_price)


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
