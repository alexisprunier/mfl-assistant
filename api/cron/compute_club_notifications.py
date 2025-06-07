from bson import ObjectId
import datetime
import httpx  # Use httpx for asynchronous HTTP requests
import logging
from utils.db import upsert_vars
from utils.date import convert_unix_to_datetime
from mail.mail_manager import send_club_listing_email, send_club_sale_email

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/"
list_url = base_url + "listings?limit=25&type=CLUB&status=AVAILABLE"
sale_url = base_url + "listings?limit=25&type=CLUB&status=BOUGHT&sorts=listing.purchaseDateTime&sortsOrders=DESC"

last_list_var = "last_treated_club_listing_datetime"
last_sale_var = "last_treated_club_sale_datetime"

logger = logging.getLogger("compute_club_notifications")
logger.setLevel(logging.INFO)


async def main(db, mail):
    users = await _get_users(db)
    user_ids = [u["_id"] for u in users]

    scopes = await _get_club_notification_scopes(db, user_ids)
    listing_scopes = [s for s in scopes if s["type"] == "listing"]
    sale_scopes = [s for s in scopes if s["type"] == "sale"]
    logger.critical(f"Number of listing/sale scopes to treat: {len(listing_scopes)}/{len(sale_scopes)}")

    # Treat listing scopes
    listings = await _get_listings_to_treat(db)
    logger.critical(f"Number of listings to treat: {len(listings)}")

    if len(listings) > 0:
        await upsert_vars(db, last_list_var, convert_unix_to_datetime(listings[0]["createdDateTime"]))

        for scope in listing_scopes:
            filtered_listings = await _filter_club_listings_per_scope(scope, listings)
            club_ids = [listing["club"]["id"] for listing in filtered_listings]

            if len(club_ids) > 0:
                user = [u for u in users if u["_id"] == scope["user"]]
                logger.critical(f"{len(user)}")

                if len(user) > 0:
                    logger.critical(f"Listing notification to send with {len(club_ids)} clubs")
                    user = user.pop()
                    notification = await _add_notification_in_db(db, scope["_id"], club_ids)
                    await send_club_listing_email(db, mail, notification, user, club_ids)

    # Treat sale scopes
    sales = await _get_sales_to_treat(db)
    logger.critical(f"Number of sales to treat: {len(sales)}")

    if len(sales) > 0:
        await upsert_vars(db, last_sale_var, convert_unix_to_datetime(sales[0]["createdDateTime"]))

        for scope in sale_scopes:
            filtered_sales = await _filter_listings_per_scope(scope, sales)
            club_ids = [sale["club"]["id"] for sale in filtered_sales]

            if len(club_ids) > 0:
                user = [u for u in users if u["_id"] == scope["user"]]

                if len(user) > 0:
                    logger.critical(f"Sale notification to send with {len(club_ids)} clubs")
                    user = user.pop()
                    notification = await _add_notification_in_db(db, scope["_id"], club_ids)
                    await send_club_sale_email(db, mail, notification, user, club_ids)


async def _get_users(db):
    filters = {
        "email": {"$regex": r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'},
        "is_email_confirmed": True,
    }
    
    return await db.users.find(filters).to_list(length=None)


async def _get_club_notification_scopes(db, user_ids):
    filters = {
        "user": {"$in": user_ids},
        "status": "active",
    }
    
    return await db.club_notification_scopes.find(filters).to_list(length=None)


async def _get_listings_to_treat(db):
    async with httpx.AsyncClient() as client:
        response = await client.get(list_url)
        listings = response.json()

    last_listing_var_record = await db.vars.find_one({"var": last_list_var})

    if last_listing_var_record:
        listings = [listing for listing in listings
                    if convert_unix_to_datetime(listing["createdDateTime"]) > last_listing_var_record["value"]]

    return listings


async def _get_sales_to_treat(db):
    async with httpx.AsyncClient() as client:
        response = await client.get(sale_url)
        sales = response.json()

    last_sale_var_record = await db.vars.find_one({"var": last_sale_var})

    if last_sale_var_record:
        sales = [sale for sale in sales
                 if convert_unix_to_datetime(sale["createdDateTime"]) > last_sale_var_record["value"]]

    return sales


async def _filter_club_listings_per_scope(scope, listings):
    return [
        l for l in listings
        if ("min_price" not in scope or scope["min_price"] is None or scope["min_price"] <= l["price"])
        and ("max_price" not in scope or scope["max_price"] is None or scope["max_price"] >= l["price"])
        and ("countries" not in scope or scope["countries"] is None or len(scope["countries"]) == 0
            or l["club"]["city"] in scope["nationalities"])
        and ("cities" not in scope or scope["cities"] is None or len(scope["cities"]) == 0
            or l["club"]["city"] in scope["cities"])
        and ("divisions" not in scope or scope["divisions"] is None or len(scope["divisions"]) == 0
            or l["club"]["division"] in scope["divisions"])
    ]


async def _add_notification_in_db(db, club_notification_scope_id, club_ids):
    notification = {
        "status": "await",
        "club_ids": club_ids,
        "creation_date": datetime.datetime.now(),
        "club_notification_scope": club_notification_scope_id,
    }

    return await db.notifications.insert_one(notification)