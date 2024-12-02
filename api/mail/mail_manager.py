from bson import ObjectId
from fastapi_mail import MessageSchema
from config import HOST
import datetime

from utils.env import get_webapp_url


def _load_template(body):
    template = open("mail/templates/template.html", 'r').read()
    template = template.replace("{body}", body)
    return template


async def send_confirmation_mail(mail, address, confirmation_code):
    body = open("mail/templates/confirmation_mail.html", 'r').read()
    body = body.format(host=HOST, confirmation_code=confirmation_code)
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] Email address confirmation",
        recipients=[address],
        subtype="html",
        body=body,
    )

    try:
        await mail.send_message(message)
    except Exception as e:
        raise


async def send_listing_email(db, mail, notification, user, player_ids):
    body = open("mail/templates/listing_notification.html", 'r').read()
    body = body.format(
        host=HOST,
        player_section=build_player_section(player_ids),
        webapp_url=get_webapp_url()
    )
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] New listing notification",
        recipients=[user["email"]],
        subtype="html",
        body=body,
    )

    try:
        await mail.send_message(message)

        filters = {"_id": ObjectId(notification.inserted_id)}
        update_data = {
            "status": "sent",
            "sending_date": datetime.datetime.now(),
        }

        await db.notifications.update_one(filters, {"$set": update_data})

        return {"message": "Email sent successfully"}
    except Exception:
        raise


async def send_sale_email(db, mail, notification, user, player_ids):
    body = open("mail/templates/sale_notification.html", 'r').read()
    body = body.format(
        host=HOST,
        player_section=build_player_section(player_ids),
        webapp_url=get_webapp_url()
    )
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] New sale notification",
        recipients=[user["email"]],
        subtype="html",
        body=body,
    )

    try:
        await mail.send_message(message)

        filters = {"_id": ObjectId(notification.inserted_id)}
        update_data = {
            "status": "sent",
            "sending_date": datetime.datetime.now(),
        }

        await db.notifications.update_one(filters, {"$set": update_data})

        return {"message": "Email sent successfully"}
    except Exception:
        raise


async def sent_daily_progress_report_email(db, mail, user, data):
    body = open("mail/templates/daily_progress_report.html", 'r').read()
    body = body.format(
        host=HOST,
        data=data
    )
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] Daily progress report",
        recipients=[user["email"]],
        subtype="html",
        body=body,
    )

    try:
        await mail.send_message(message)

        update_data = {
            "status": "sent",
            "sending_date": datetime.datetime.now(),
        }

        await db.reports.insert_one(update_data)

        return {"message": "Email sent successfully"}
    except Exception:
        raise


def build_player_section(player_ids):
    player_section = "<div>"

    for i in player_ids:
        player_section += f"<img" \
                          f" src='https://d13e14gtps4iwl.cloudfront.net/players/{i}/card_512.png'" \
                          f" style='width: 150px'" \
                          f"/>" \
                          f"<a href='https://app.playmfl.com/players/{i}' target='_blank'>See on MFL</button>" \
                          f"<a href='https://mflplayer.info/player/{i}' target='_blank'>See on MFL Player Info</button>"

    player_section += "</div>"

    return player_section
