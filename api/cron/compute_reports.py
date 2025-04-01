from bson import ObjectId
import datetime
import requests
import logging
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

        if (
            last_computation_time.time() <= config_time <= new_computation_time.time()
            or (last_computation_time.time() > new_computation_time.time() and (
                config_time >= last_computation_time.time() or config_time <= new_computation_time.time()))
        ):
            user = [u for u in users if u["_id"] == config["user"]]

            if len(user) > 0:
                user = user.pop()
                data = await _get_progress_data(db, user["address"])
                data = {key: value for key, value in data.items() if value is not None}
                data = dict(sorted(data.items(), key=lambda item: ('overall' not in item[1], item[0])))
                await sent_daily_progress_report_email(db, mail, user, data)

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

    logger.warning(f"PROGRESS REPORT: Number of active progress report: {len(configurations)}")
    
    return configurations


async def _get_progress_data(db, address):
    data = requests.get(url=base_url + address).json()

    return data
