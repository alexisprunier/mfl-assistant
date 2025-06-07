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
        subject="[MFL-A] New player listing notification",
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
        subject="[MFL-A] New player sale notification",
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


async def send_club_listing_email(db, mail, notification, user, club_ids):
    body = open("mail/templates/club_listing_notification.html", 'r').read()
    body = body.format(
        host=HOST,
        club_section=build_club_section(club_ids),
        webapp_url=get_webapp_url()
    )
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] New club listing notification",
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


async def send_club_sale_email(db, mail, notification, user, club_ids):
    body = open("mail/templates/club_sale_notification.html", 'r').read()
    body = body.format(
        host=HOST,
        club_section=build_club_section(club_ids),
        webapp_url=get_webapp_url()
    )
    body = _load_template(body)

    message = MessageSchema(
        subject="[MFL-A] New club sale notification",
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
        player_section=build_player_progress_section(data),
        webapp_url=get_webapp_url()
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
    player_section = "<div style='font-family: Arial, sans-serif;'>"

    for i in player_ids:
        player_section += (
            "<table style='width: 100%; border-spacing: 10px; margin-bottom: 20px;'>"
            "<tr>"
            f"<td style='vertical-align: top; width: 160px;'>"
            f"<img src='https://d13e14gtps4iwl.cloudfront.net/players/{i}/card_512.png' "
            f"style='width: 80px;' />"
            "</td>"
            "<td style='vertical-align: top;'>"
            "<div>"
            f"<a href='https://app.playmfl.com/players/{i}' target='_blank' "
            f"style='text-decoration: none; color: #0dcaf0; font-weight: bold; margin-right: 10px;'>See on MFL</a>"
            f"<br/><a href='https://mflplayer.info/player/{i}' target='_blank' "
            f"style='text-decoration: none; color: #0dcaf0; font-weight: bold;'>See on MFL Player Info</a>"
            "</div>"
            "</td>"
            "</tr>"
            "</table>"
            "<hr style='border: 0; border-top: 1px solid #555;' />"
        )

    player_section += "</div>"

    return player_section

def build_club_section(club_ids):
    club_section = "<div style='font-family: Arial, sans-serif;'>"

    for i in club_ids:
        club_section += (
            "<table style='width: 100%; border-spacing: 10px; margin-bottom: 20px;'>"
            "<tr>"
            f"<td style='vertical-align: top; width: 160px;'>"
            f"<img src='https://d13e14gtps4iwl.cloudfront.net/u/clubs/{i}/logo.png?v=63c386597972f1fcbdcef019a7b453c8' "
            f"style='width: 80px;' />"
            "</td>"
            "<td style='vertical-align: top;'>"
            "<div>"
            f"<a href='https://app.playmfl.com/club/{i}' target='_blank' "
            f"style='text-decoration: none; color: #0dcaf0; font-weight: bold; margin-right: 10px;'>See on MFL</a>"
            "</div>"
            "</td>"
            "</tr>"
            "</table>"
            "<hr style='border: 0; border-top: 1px solid #555;' />"
        )

    club_section += "</div>"

    return club_section

def build_player_progress_section(data):
    player_section = "<div style='font-family: Arial, sans-serif;'>"

    for i, progress in data.items():
        player_section += (
            "<table style='width: 100%; border-spacing: 10px;'>"
            "<tr>"
            f"<td style='vertical-align: top; width: 110px;'>"
            f"<img src='https://d13e14gtps4iwl.cloudfront.net/players/{i}/card_512.png' "
            f"style='width: 80px;' />"
            "</td>"
            "<td style='vertical-align: top;'>"
        )

        for attribute, value in progress.items():
            if attribute == "overall":
                player_section += f"<div style='font-size: 20px; font-weight: bold; color: #0dcaf0'>{attribute}: +{value}</div>"
            else:
                player_section += f"<div style='font-size: 14px; color: white;'>{attribute}: +{value}</div>"

        player_section += (
            "<div style='margin-top: 16px;'>"
            "<div>"
            f"<div><a href='https://app.playmfl.com/players/{i}' target='_blank' "
            f"style='font-size: 10px; color: #adb5bd; font-weight: bold; margin-right: 10px;'>View on MFL</a>"
            f"</div><div><a href='https://mflplayer.info/player/{i}' target='_blank' "
            f"style='font-size: 10px; color: #adb5bd; font-weight: bold;'>View on MFL Player</a>"
            "</div></div>"
        )

        player_section += "</div></td></tr></table><hr style='border: 0; border-top: 1px solid #555;' />"

    player_section += "</div>"

    return player_section