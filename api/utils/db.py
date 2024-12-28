from bson import ObjectId
from pymongo import ReturnDocument
import datetime
from utils.date import convert_unix_to_datetime


async def upsert_vars(db, var, value):
    var_record = await db.vars.find_one({"var": var})

    if var_record:
        filters = {"_id": var_record["_id"]}
        update_data = {
            "value": value,
        }

        await db.vars.update_one(filters, {"$set": update_data})
    else:
        await db.vars.insert_one({
            "var": var,
            "value": value
        })


async def get_var_value(db, var):
    record = await db.vars.find_one({"var": var})
    return record["value"] if record else None


async def upsert_user(db, user):
    if "address" in user:
        return await db.users.find_one_and_update(
        	{"address": user["address"]},
        	{"$set": user},
        	upsert=True,
        	return_document=ReturnDocument.AFTER
        )
    return None

async def upsert_player(db, player):
    return await db.players.find_one_and_update(
        {"_id": player["_id"]},
        {"$set": player},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )

async def upsert_club(db, club):
    return await db.clubs.find_one_and_update(
        {"_id": club["_id"]},
        {"$set": club},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )

async def upsert_sale(db, sale):
    return await db.sales.find_one_and_update(
        {"_id": sale["_id"]},
        {"$set": sale},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )


async def upsert_contract(db, contract):
    return await db.contracts.find_one_and_update(
        {"_id": contract["_id"]},
        {"$set": contract},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )


async def build_and_upsert_user(db, mfl_user):
    if "walletAddress" not in mfl_user or mfl_user["walletAddress"] is None:
        return None

    user = {}

    if "walletAddress" in mfl_user:
        user["address"] = mfl_user["walletAddress"]
    if "name" in mfl_user:
        user["name"] = mfl_user["name"]

    return await upsert_user(db, user)


async def build_and_upsert_player(db, mfl_player, owner=None):
    if "id" not in mfl_player or mfl_player["id"] is None:
        return None

    player = {
        "_id": mfl_player["id"]
    }

    if "metadata" in mfl_player:
        if "firstName" in mfl_player["metadata"]:
            player["first_name"] = mfl_player["metadata"]["firstName"]
        if "lastName" in mfl_player["metadata"]:
            player["last_name"] = mfl_player["metadata"]["lastName"]

        if "overall" in mfl_player["metadata"]:
            player["overall"] = mfl_player["metadata"]["overall"]
        if "nationalities" in mfl_player["metadata"]:
            player["nationalities"] = mfl_player["metadata"]["nationalities"]
        if "positions" in mfl_player["metadata"]:
            player["positions"] = mfl_player["metadata"]["positions"]
        if "height" in mfl_player["metadata"]:
            player["height"] = mfl_player["metadata"]["height"]
        if "preferredFoot" in mfl_player["metadata"]:
            player["preferred_foot"] = mfl_player["metadata"]["preferredFoot"]
        if "age" in mfl_player["metadata"]:
            player["age"] = mfl_player["metadata"]["age"]

        if "pace" in mfl_player["metadata"]:
            player["pace"] = mfl_player["metadata"]["pace"]
        if "shooting" in mfl_player["metadata"]:
            player["shooting"] = mfl_player["metadata"]["shooting"]
        if "passing" in mfl_player["metadata"]:
            player["passing"] = mfl_player["metadata"]["passing"]
        if "dribbling" in mfl_player["metadata"]:
            player["dribbling"] = mfl_player["metadata"]["dribbling"]
        if "defense" in mfl_player["metadata"]:
            player["defense"] = mfl_player["metadata"]["defense"]
        if "physical" in mfl_player["metadata"]:
            player["physical"] = mfl_player["metadata"]["physical"]
        if "goalkeeping" in mfl_player["metadata"]:
            player["goalkeeping"] = mfl_player["metadata"]["goalkeeping"]
        if "resistance" in mfl_player["metadata"]:
            player["resistance"] = mfl_player["metadata"]["resistance"]

    if owner and "_id" in owner:
        player["owner"] = owner["_id"]

    return await upsert_player(db, player)


async def build_and_upsert_club(db, mfl_club, owner=None):
    if "id" not in mfl_club or mfl_club["id"] is None:
        return None

    club = {
        "_id": mfl_club["id"],
        "last_computation_date": datetime.datetime.now(),
    }

    if "status" in mfl_club:
        club["status"] = mfl_club["status"]
    if "name" in mfl_club:
        club["name"] = mfl_club["name"]
    if "division" in mfl_club:
        club["division"] = mfl_club["division"]
    if "city" in mfl_club:
        club["city"] = mfl_club["city"]
    if "country" in mfl_club:
        club["country"] = mfl_club["country"]
    if "foundationDate" in mfl_club:
        club["foundation_date"] = convert_unix_to_datetime(mfl_club["foundationDate"]) \
            if "foundationDate" in mfl_club else None
    if "country" in mfl_club:
        club["country"] = mfl_club["country"]

    if owner and "_id" in owner:
        club["owner"] = owner["_id"]

    return await upsert_club(db, club)


async def build_and_upsert_sale(db, mfl_sale, player=None, club=None):

    sale = {
        "_id": mfl_sale["id"],
        "price": mfl_sale["price"],
        "execution_date": convert_unix_to_datetime(mfl_sale["purchaseDateTime"]),
    }

    if player is not None:
        sale["player"] = player["_id"]
        sale["overall"] = player["overall"]
        sale["age"] = player["age"]
        sale["positions"] = player["positions"]

    if club is not None:
        sale["club"] = club["_id"]
        sale["division"] = club["division"]
    
    return await upsert_sale(db, sale)


async def build_and_upsert_contract(db, mfl_contract, player=None, club=None):
    if "id" not in mfl_contract or mfl_contract["id"] is None:
        return None

    contract = {
        "_id": mfl_contract["id"],
        "last_computation_date": datetime.datetime.now(),
    }

    if "status" in mfl_contract:
        contract["status"] = mfl_contract["status"]
    if "revenueShare" in mfl_contract:
        contract["revenue_share"] = mfl_contract["revenueShare"]
    if "revenueShare" in mfl_contract:
        contract["total_revenue_share_locked"] = mfl_contract["revenueShare"]
    if "startSeason" in mfl_contract:
        contract["start_season"] = mfl_contract["startSeason"]
    if "nbSeasons" in mfl_contract:
        contract["number_of_season"] = mfl_contract["nbSeasons"]
    if "autoRenewal" in mfl_contract:
        contract["auto_renewal"] = mfl_contract["autoRenewal"]
    if "createdDateTime" in mfl_contract:
        contract["creation_date"] = convert_unix_to_datetime(mfl_contract["createdDateTime"]) \
            if "createdDateTime" in mfl_contract else None

    if player and "_id" in player:
        contract["player"] = player["_id"]

    if club and "_id" in club:
        contract["club"] = club["_id"]

    return await upsert_contract(db, contract)
