import logging
import httpx
from utils.db import get_var_value, upsert_vars, build_and_upsert_player, build_and_upsert_club, build_and_upsert_sale, build_and_upsert_user
from utils.date import convert_unix_to_datetime

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/listings/feed?limit=25"
last_treated_sale_datetime_var = "last_treated_sale_datetime"

logger = logging.getLogger("collect_sales")
logger.setLevel(logging.INFO)


async def main(db):

    last_treated_sale_datetime = await get_var_value(db, last_treated_sale_datetime_var)
    new_last_treated_sale_datetime = None
    next_before_listing_id = None
    continue_treatment = True

    # Use httpx.AsyncClient() to make asynchronous requests
    async with httpx.AsyncClient() as client:
        # Treat the new ones
        while continue_treatment:
            logger.critical("collect_sales: Treat new ones, next_before_listing_id: " + str(next_before_listing_id))

            try:
                response = await client.get(
                    url=base_url + ("" if next_before_listing_id is None else f"&beforeListingId={next_before_listing_id}")
                )

                if response.status_code == 200:
                    sales = response.json()

                    for s in sales:
                        if new_last_treated_sale_datetime is None:
                            new_last_treated_sale_datetime = convert_unix_to_datetime(s["purchaseDateTime"])

                        if continue_treatment:
                            if last_treated_sale_datetime is None or convert_unix_to_datetime(s["purchaseDateTime"]) > last_treated_sale_datetime:
                                await _treat_sale(db, s)
                            else:
                                continue_treatment = False

                    if last_treated_sale_datetime is None:
                        continue_treatment = False
                    else:
                        next_before_listing_id = sales[-1]["id"]
            except httpx.RequestError as e:
                logger.error(f"Error making request to the sales API: {e}")
                break  # Exit the loop if there's a request error

        # Update the last treated sale datetime after processing new ones
        await upsert_vars(db, last_treated_sale_datetime_var, new_last_treated_sale_datetime)

        # Treat the old ones
        oldest_sale = await db.sales.find_one(sort=[('execution_date', 1)])

        if oldest_sale:
            logger.critical("collect_sales: SMALLEST: " + f"{base_url}&beforeListingId={oldest_sale['_id']}")
            try:
                response = await client.get(
                    url=f"{base_url}&beforeListingId={oldest_sale['_id']}"
                )

                if response.status_code == 200:
                    sales = response.json()

                    for s in sales:
                        await _treat_sale(db, s)

            except httpx.RequestError as e:
                logger.error(f"Error making request to the sales API: {e}")


async def _treat_sale(db, mfl_sale):
    user = await build_and_upsert_user(db, mfl_sale["player"]["ownedBy"]) if "player" in mfl_sale and "ownedBy" in mfl_sale["player"] else None
    player = await build_and_upsert_player(db, mfl_sale["player"], user) if "player" in mfl_sale else None
    club = await build_and_upsert_club(db, mfl_sale["club"]) if "club" in mfl_sale else None
    return await build_and_upsert_sale(db, mfl_sale, player, club)