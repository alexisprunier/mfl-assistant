from fastapi import FastAPI, Request, Response
from fastapi_mail import ConnectionConfig, FastMail
from apscheduler.schedulers.asyncio import AsyncIOScheduler 
from graphene import Schema
from starlette_graphene3 import GraphQLApp, make_graphiql_handler
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from graph.query import Query
from graph.mutation import Mutation
import config
from cron import compute_notifications, compute_reports, collect_matches, collect_clubs, collect_sales, collect_players, \
    compute_club_count_per_day, compute_sale_total, compute_raw_player_pricings, compute_player_pricings, collect_users, \
    compute_formation_meta
from endpoint.generate_nonce import generate_nonce
from utils.jwt import create_access_token
from utils.cookie import set_cookie
from fastapi.responses import HTMLResponse
import json
from datetime import datetime, timedelta
from utils.flow import verify_signature

# FastAPI setup

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Plugins

db = AsyncIOMotorClient(config.DB_URL)[config.DB_CONFIG["database"]]
mail = FastMail(ConnectionConfig(**config.MAIL_CONFIG))

# Setup indexes

db.clubs.create_index(
    [
        ('name', 'text'),
        ('city', 'text'),
        ('country', 'text')
    ],
    weights={
        'name': 10,
        'city': 5,
        'country': 2
    }
)

# Setup GraphQL

def get_context_value(request: Request) -> dict:
    return {
        "request": request,
        "mail": mail,
        "db": db,
    }

graphql = GraphQLApp(
    schema=Schema(query=Query, mutation=Mutation),
    on_get=make_graphiql_handler(),
    context_value=get_context_value,
)
graphql_admin = GraphQLApp(
    schema=Schema(query=Query, mutation=Mutation),
    on_get=make_graphiql_handler(),
    context_value=get_context_value,
)

# To move in right file later

async def confirm_email(request: Request):
    confirmation_code = request.query_params.get('confirmation_code')

    if confirmation_code is not None:

        user = await db.users.find_one({"confirmation_code": {"$eq": confirmation_code}})

        if user:
            user["confirmation_code"] = None
            user["is_email_confirmed"] = True
            db.users.update_one({"confirmation_code": confirmation_code}, {"$set": user})

            return HTMLResponse(content="<p>The email has been confirmed</p>")

    return HTMLResponse(content="<p>Unknown confirmation code</p>")

# To move in right file later

@app.post("/api/login")
async def login(request: Request, response: Response):
    service = await request.json()

    if await verify_signature(service):
        user = await db.users.find_one({"address": {"$eq": service["address"]}})

        if not user:
            db.users.insert_one({"address": service["address"]})

        expire_delta = timedelta(minutes=24 * 60)

        token = create_access_token(
            {"address": service["address"]},
            expires_delta=expire_delta,
        )

        response = set_cookie(request, response, "access_token_cookie", token, 24 * 60 * 60)

        return "You can find the token in the Set-Cookie HTTP response header"

    return HTMLResponse(content="Provided service is not valid")

@app.post("/api/logout")
async def logout(request: Request, response: Response):
    response = set_cookie(request, response, "access_token_cookie", None, 0)
    return "Logging out has been a success"


# Manage routes

app.add_route("/graphql", graphql)
app.add_route("/graphql/admin", graphql_admin)
app.add_route("/api/generate_nonce", generate_nonce)
app.add_route("/api/confirm_email", confirm_email)

# Manage cron

scheduler = AsyncIOScheduler()

scheduler.add_job(compute_notifications.main,       'interval', args=[db, mail],    seconds=24)
scheduler.add_job(compute_reports.main,             'interval', args=[db, mail],    seconds=40)

scheduler.add_job(collect_clubs.main,               'interval', args=[db],          seconds=60)
scheduler.add_job(collect_sales.main,               'interval', args=[db],          seconds=28)
scheduler.add_job(collect_players.main,             'interval', args=[db],          seconds=26)
scheduler.add_job(collect_matches.main,             'interval', args=[db],          seconds=32)
scheduler.add_job(collect_users.main,               'interval', args=[db],          seconds=20)

scheduler.add_job(compute_club_count_per_day.main,  'interval', args=[db],          seconds=60 * 20)
scheduler.add_job(compute_sale_total.main,          'interval', args=[db],          seconds=60 * 25)
scheduler.add_job(compute_raw_player_pricings.main, 'interval', args=[db],          seconds=60 * 10)
scheduler.add_job(compute_player_pricings.main,     'interval', args=[db],          seconds=60 * 60)
scheduler.add_job(compute_formation_meta.main,      'interval', args=[db],          seconds=30 * 15)
scheduler.start()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=config.PORT)
