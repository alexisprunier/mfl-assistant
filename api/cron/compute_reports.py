from bson import ObjectId
import datetime
import logging
import httpx  # Using httpx instead of aiohttp
from utils.db import upsert_vars
from utils.date import convert_unix_to_datetime
from mail.mail_manager import sent_daily_progress_report_email

base_url = "https://z519wdyajg.execute-api.us-east-1.amazonaws.com/prod/players/progressions?interval=24H&ownerWalletAddress="

last_computation_var = "last_daily_progress_report_computation"

logger = logging.getLogger("compute_notification")
logger.setLevel(logging.INFO)


async def main(db, mail):
    users = await _get_users(db)
    user_ids = [u["_id"] for u in users]

    last_computation = await db.vars.find_one({"var": last_computation_var})
    last_computation_time = last_computation.get("value") if last_computation else None
    new_computation_time = datetime.datetime.now()

    # Skip computation if the last computation was more than 10 minutes ago
    if last_computation_time is None or (new_computation_time - last_computation_time).total_seconds() > 600:
        logger.warning("Skipping computation as the difference is greater than 10 minutes.")
        await upsert_vars(db, last_computation_var, new_computation_time)
        return

    configurations = await _get_daily_progress_report_configurations(db)

    for config in configurations:
        try:
            config_time = datetime.datetime.strptime(config["time"], "%H:%M").time()
        except ValueError:
            logger.warning(f"Invalid time format in configuration: {config['time']}")
            continue

        # Check if the time interval is within the expected range
        if (
            last_computation_time.time() <= config_time <= new_computation_time.time()
            or (last_computation_time.time() > new_computation_time.time() and (
                config_time >= last_computation_time.time() or config_time <= new_computation_time.time()))
        ):
            user = [u for u in users if u["_id"] == config["user"]]

            if len(user) > 0:
                user = user.pop()
                # Fetch progress data asynchronously
                data = await _get_progress_data(user["address"])
                # Filter out None values and sort the data
                data = {key: value for key, value in data.items() if value is not None}
                data = dict(sorted(data.items(), key=lambda item: ('overall' not in item[1], item[0])))
                # Send daily progress report via email
                await sent_daily_progress_report_email(db, mail, user, data)

    # Update the last computation time in the database
    await upsert_vars(db, last_computation_var, new_computation_time)


async def _get_users(db):
    filters = {
        "email": {"$regex": r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'},
        "is_email_confirmed": True,
    }
    
    return await db.users.find(filters).to_list(length=None)


async def _get_daily_progress_report_configurations(db):
    filters = {
        "type": "daily_progress_report",
        "time": {"$ne": None},
    }

    configurations = await db.report_configurations.find(filters).to_list(length=None)

    logger.warning(f"PROGRESS REPORT: Number of active progress reports: {len(configurations)}")
    
    return configurations


# Use httpx to asynchronously fetch progress data from the external API
async def _get_progress_data(address):
    async with httpx.AsyncClient() as client:
        response = await client.get(base_url + address)
        data = response.json()
    return data