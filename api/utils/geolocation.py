from fuzzywuzzy import process
import Levenshtein
from pymongo import ReturnDocument

import geonamescache

gc = geonamescache.GeonamesCache()

async def get_geolocation(db, country, city):
    if country:
        existing_match = await db.geolocations.find_one({"city": city, "country": country})
        
        if existing_match:
            return existing_match
        else:
            lat, long = await get_lat_long(country, city)

            if lat is not None and long is not None:
                match = {
                    "city": city.strip() if city else city,
                    "country": country,
                    "latitude": lat,
                    "longitude": long
                }

                return await db.geolocations.find_one_and_update(
                    {"country": match["country"], "city": match["city"]},
                    {"$set": match},
                    upsert=True,
                    return_document=ReturnDocument.AFTER
                )
    
    return None

async def get_lat_long(country: str, city: str = None):
    lat = lon = None
    best_match = None
    highest_score = 0

    if not country:
        return None, None  # If no country is provided, return None

    search_string = f"{city.strip()}, {country}" if city else country

    # Fetch cities and countries from geonamescache
    cities = gc.get_cities()
    countries = gc.get_countries()

    # Generate a dictionary mapping city-country pairs
    city_country_mapping = {
        f"{city_data['name']}, {countries[city_data['countrycode']]['name']}": city_data
        for city_data in cities.values()
        if city_data["countrycode"] in countries
    }

    # Find the best match using fuzzy string matching
    best_match, score = process.extractOne(search_string, city_country_mapping.keys(), scorer=Levenshtein.ratio)

    if best_match and score > 0.6:
        city_data = city_country_mapping.get(best_match)
        if city_data:
            lat = city_data.get("latitude")
            lon = city_data.get("longitude")

    return lat, lon