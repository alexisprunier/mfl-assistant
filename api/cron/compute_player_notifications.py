from bson import ObjectId
import datetime
import httpx  # Use httpx for asynchronous HTTP requests
import logging
from utils.db import upsert_vars
from utils.date import convert_unix_to_datetime
from mail.mail_manager import send_listing_email, send_sale_email

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/"
list_url = base_url + "listings?limit=25&type=PLAYER&status=AVAILABLE"
sale_url = base_url + "listings?limit=25&type=PLAYER&status=BOUGHT&sorts=listing.purchaseDateTime&sortsOrders=DESC"

last_list_var = "last_treated_listing_datetime"
last_sale_var = "last_treated_sale_datetime"

logger = logging.getLogger("compute_player_notifications")
logger.setLevel(logging.INFO)


async def main(db, mail):
    users = await _get_users(db)
    user_ids = [u["_id"] for u in users]

    scopes = await _get_notification_scopes(db, user_ids)
    listing_scopes = [s for s in scopes if s["type"] == "listing"]
    sale_scopes = [s for s in scopes if s["type"] == "sale"]
    logger.critical(f"Number of listing/sale scopes to treat: {len(listing_scopes)}/{len(sale_scopes)}")

    # Treat listing scopes
    listings = await _get_listings_to_treat(db)
    logger.critical(f"Number of listings to treat: {len(listings)}")

    if len(listings) > 0:
        await upsert_vars(db, last_list_var, convert_unix_to_datetime(listings[0]["createdDateTime"]))

        for scope in listing_scopes:
            filtered_listings = await _filter_listings_per_scope(scope, listings)
            player_ids = [listing["player"]["id"] for listing in filtered_listings]

            if len(player_ids) > 0:
                user = [u for u in users if u["_id"] == scope["user"]]
                logger.critical(f"{len(user)}")

                if len(user) > 0:
                    logger.critical(f"Listing notification to send with {len(player_ids)} players")
                    user = user.pop()
                    notification = await _add_notification_in_db(db, scope["_id"], player_ids)
                    await send_listing_email(db, mail, notification, user, player_ids)

    # Treat sale scopes
    sales = await _get_sales_to_treat(db)
    logger.critical(f"Number of sales to treat: {len(sales)}")

    if len(sales) > 0:
        await upsert_vars(db, last_sale_var, convert_unix_to_datetime(sales[0]["createdDateTime"]))

        for scope in sale_scopes:
            filtered_sales = await _filter_listings_per_scope(scope, sales)
            player_ids = [sale["player"]["id"] for sale in filtered_sales]

            if len(player_ids) > 0:
                user = [u for u in users if u["_id"] == scope["user"]]

                if len(user) > 0:
                    logger.critical(f"Sale notification to send with {len(player_ids)} players")
                    user = user.pop()
                    notification = await _add_notification_in_db(db, scope["_id"], player_ids)
                    await send_sale_email(db, mail, notification, user, player_ids)


async def _get_users(db):
    filters = {
        "email": {"$regex": r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'},
        "is_email_confirmed": True,
    }
    
    return await db.users.find(filters).to_list(length=None)


async def _get_notification_scopes(db, user_ids):
    filters = {
        "user": {"$in": user_ids},
        "status": "active",
    }
    
    return await db.notification_scopes.find(filters).to_list(length=None)


async def _get_listings_to_treat(db):
    timeout = httpx.Timeout(10.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            response = await client.get(list_url)
            listings = response.json()
        except httpx.ReadTimeout:
            logger.critical(f"compute_player_notifications: Timeout while fetching listings from {list_url}")
            listings = []

    last_listing_var_record = await db.vars.find_one({"var": last_list_var})

    if last_listing_var_record and last_listing_var_record["value"]:
        listings = [listing for listing in listings
                    if convert_unix_to_datetime(listing["createdDateTime"]) > last_listing_var_record["value"]]

    return listings


async def _get_sales_to_treat(db):
    timeout = httpx.Timeout(10.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            response = await client.get(sale_url)
            sales = response.json()
        except httpx.ReadTimeout:
            logger.critical(f"compute_player_notifications: Timeout while fetching sales from {sale_url}")
            sales = []

    last_sale_var_record = await db.vars.find_one({"var": last_sale_var})

    if last_sale_var_record and last_sale_var_record["value"]:
        sales = [sale for sale in sales
                 if convert_unix_to_datetime(sale["createdDateTime"]) > last_sale_var_record["value"]]

    return sales


async def _filter_listings_per_scope(scope, listings):
    return [
        l for l in listings
        if ("min_price" not in scope or scope["min_price"] is None or scope["min_price"] <= l["price"])
        and ("max_price" not in scope or scope["max_price"] is None or scope["max_price"] >= l["price"])
        and ("min_age" not in scope or scope["min_age"] is None or scope["min_age"] <= l["player"]["metadata"]["age"])
        and ("max_age" not in scope or scope["max_age"] is None or scope["max_age"] >= l["player"]["metadata"]["age"])
        and ("min_ovr" not in scope or scope["min_ovr"] is None or scope["min_ovr"] <= l["player"]["metadata"]["overall"])
        and ("max_ovr" not in scope or scope["max_ovr"] is None or scope["max_ovr"] >= l["player"]["metadata"]["overall"])
        and ("min_pac" not in scope or scope["min_pac"] is None or scope["min_pac"] <= l["player"]["metadata"]["pace"])
        and ("max_pac" not in scope or scope["max_pac"] is None or scope["max_pac"] >= l["player"]["metadata"]["pace"])
        and ("min_dri" not in scope or scope["min_dri"] is None or scope["min_dri"] <= l["player"]["metadata"]["dribbling"])
        and ("max_dri" not in scope or scope["max_dri"] is None or scope["max_dri"] >= l["player"]["metadata"]["dribbling"])
        and ("min_pas" not in scope or scope["min_pas"] is None or scope["min_pas"] <= l["player"]["metadata"]["passing"])
        and ("max_pas" not in scope or scope["max_pas"] is None or scope["max_pas"] >= l["player"]["metadata"]["passing"])
        and ("min_sho" not in scope or scope["min_sho"] is None or scope["min_sho"] <= l["player"]["metadata"]["shooting"])
        and ("max_sho" not in scope or scope["max_sho"] is None or scope["max_sho"] >= l["player"]["metadata"]["shooting"])
        and ("min_def" not in scope or scope["min_def"] is None or scope["min_def"] <= l["player"]["metadata"]["defense"])
        and ("max_def" not in scope or scope["max_def"] is None or scope["max_def"] >= l["player"]["metadata"]["defense"])
        and ("min_phy" not in scope or scope["min_phy"] is None or scope["min_phy"] <= l["player"]["metadata"]["physical"])
        and ("max_phy" not in scope or scope["max_phy"] is None or scope["max_phy"] >= l["player"]["metadata"]["physical"])
        and ("nationalities" not in scope or scope["nationalities"] is None or len(scope["nationalities"]) == 0
            or l["player"]["metadata"]["nationalities"][0] in scope["nationalities"])
        and ("positions" not in scope or scope["positions"] is None or len(scope["positions"]) == 0 or (
            l["player"]["metadata"]["positions"][0] in scope["positions"]
                if "primary_position_only" in scope and scope["primary_position_only"]
                else set(scope["positions"]) & set(l["player"]["metadata"]["positions"])
            )
        )
    ]


async def _add_notification_in_db(db, notification_scope_id, player_ids):
    notification = {
        "status": "await",
        "player_ids": player_ids,
        "creation_date": datetime.datetime.now(),
        "notification_scope": notification_scope_id,
    }

    return await db.notifications.insert_one(notification)