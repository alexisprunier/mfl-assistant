from graphene import ObjectType, String, Int, Schema, Field, List, ID, Boolean, Date
from graph.schema import RawPlayerPricingType, PlayerPricingType, UserType, GeolocationType, SaleType, ContractType, NotificationScopeType, NotificationType, CountType, DataPointType, ClubType, TeamType, TeamMemberType, PlayerType, ReportConfigurationType, ReportType
from bson import ObjectId
from decorator.require_token import require_token
from decorator.add_token_if_exists import add_token_if_exists
from fastapi import HTTPException, status
from datetime import datetime, timedelta


class Query(ObjectType):

    get_logged_user = Field(UserType)

    @require_token
    def resolve_get_logged_user(self, info):
        return info.context["user"]

    get_notification_scopes = List(NotificationScopeType)

    @require_token
    async def resolve_get_notification_scopes(self, info):
        return await info.context["db"].notification_scopes \
            .find({"user": info.context["user"]["_id"]}) \
            .to_list(length=None)

    get_notifications = List(NotificationType, notification_scope=String(), skip=Int(), limit=Int(), sort=String(), order=Int())

    @require_token
    async def resolve_get_notifications(self, info, notification_scope=None, skip=0, limit=10, sort="_id", order=1):

        if notification_scope:
            notification_scope = await info.context["db"].notification_scopes \
                .find_one({"_id": ObjectId(notification_scope)})

            if not notification_scope:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, # to change to 404
                    detail="Notification scope not found",
                )

            if info.context["user"]["_id"] != notification_scope["user"]:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="This user does not have access to this notification scope",
                )

            notification_scopes = [notification_scope]

        else:
            notification_scopes = await info.context["db"].notification_scopes \
                .find({"user": info.context["user"]["_id"]}) \
                .to_list(length=None)

        notification_scope_ids = [s["_id"] for s in notification_scopes]

        notifications = await info.context["db"].notifications \
            .find({"notification_scope": { "$in": notification_scope_ids }}) \
            .sort(sort, -1 if order < 0 else 1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return notifications

    get_report_configurations = List(ReportConfigurationType)

    @require_token
    async def resolve_get_report_configurations(self, info):
        return await info.context["db"].report_configurations \
            .find({"user": info.context["user"]["_id"]}) \
            .to_list(length=None)

    get_clubs = List(ClubType, search=String(), owners=List(String), skip=Int(), limit=Int(), sort=String(), order=Int())

    async def resolve_get_clubs(self, info, search=None, owners=None, skip=0, limit=500, sort="_id", order=1):

        clubs = info.context["db"].clubs

        filters = {}

        if owners is not None:
            filters["owner"] = {"$in": [ObjectId(o) for o in owners]}

        if search:
            words = [] if search is None else [w for w in search.split(" ") if len(w) > 1]

            regex_query = {
                "$and": [
                    {
                        "$or": [
                            {"name": {"$regex": word, "$options": "i"}},
                            {"city": {"$regex": word, "$options": "i"}},
                            {"country": {"$regex": word, "$options": "i"}}
                        ]
                    }
                    for word in words
                ]
            }

            filters = {
                "$and": [
                    filters,
                    regex_query
                ]
            }

        clubs = await clubs \
            .find(filters) \
            .sort(sort, -1 if order < 0 else 1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return clubs

    get_sales = List(SaleType, type=String(), min_date=Date(), max_date=Date(), min_ovr=Int(), max_ovr=Int(), positions=List(String), first_position_only=Boolean(), min_age=Int(), max_age=Int(), skip=Int(), limit=Int(), sort=String(), order=Int())

    async def resolve_get_sales(self, info, type=None, min_date=None, max_date=None, min_ovr=0, max_ovr=99, positions=None, first_position_only=False, min_age=0, max_age=99, skip=0, limit=10, sort="execution_date", order=-1):

        sales = info.context["db"].sales

        if type == "PLAYER":
            if first_position_only:
                filters = {
                    "player": {"$exists": True, "$ne": None},
                    "overall": {"$gte": min_ovr, "$lte": max_ovr},
                    "age": {"$gte": min_age, "$lte": max_age},
                    "positions.0": {"$in": positions}
                }
            else:
                filters = {
                    "player": {"$exists": True, "$ne": None},
                    "overall": {"$gte": min_ovr, "$lte": max_ovr},
                    "age": {"$gte": min_age, "$lte": max_age},
                    "positions": {"$in": positions},
                }

            execution_date_filter = {}

            if min_date:
                execution_date_filter["$gte"] = min_date
            if max_date:
                execution_date_filter["$lte"] = max_date

            if execution_date_filter:
                filters["execution_date"] = execution_date_filter

            sales = await sales \
                .find(filters) \
                .to_list(None)

            return sales
        elif type == "CLUB":
            filters = {
                "club": {"$exists": True, "$ne": None},
            }

            execution_date_filter = {}

            if min_date:
                execution_date_filter["$gte"] = min_date
            if max_date:
                execution_date_filter["$lte"] = max_date

            if execution_date_filter:
                filters["execution_date"] = execution_date_filter

            sales = sales.find(filters)

        sales = await sales \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return sales

    get_club_count = Int(founded_only=Boolean())

    async def resolve_get_club_count(self, info, founded_only=True):
        query = [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            },
            {"$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}},
            {"$count": "count"}
        ]

        if founded_only:
            query.insert(0, {"$match": {"status": "FOUNDED"}})

        return [c["count"] async for c in info.context["db"].clubs.aggregate(query)][0]

    class CountPerGeolocationType(ObjectType):
        count = Int()
        geolocation = Field(GeolocationType)

    get_club_count_per_geolocation = List(CountPerGeolocationType, founded_only=Boolean(), geographic=String())

    async def resolve_get_club_count_per_geolocation(self, info, founded_only=True, geographic="city"):
        db = info.context["db"]

        # Validate geographic argument
        if geographic not in ("city", "country"):
            raise ValueError("Invalid geographic argument. Must be 'city' or 'country'.")

        query = []

        # Optionally filter by status
        if founded_only:
            query.append({"$match": {"status": "FOUNDED"}})

        # Join with users to exclude specific owners
        query += [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            },
            {"$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}}
        ]

        # Join with geolocations so we can group by city/country
        query += [
            {
                "$lookup": {
                    "from": "geolocations",
                    "localField": "geolocation",
                    "foreignField": "_id",
                    "as": "geolocation_info"
                }
            },
            {"$unwind": "$geolocation_info"},
            {
                "$group": {
                    "_id": f"$geolocation_info.{geographic}",
                    "count": {"$sum": 1},
                    "sample_geo": {"$first": "$geolocation_info"}  # Pick one for metadata
                }
            },
            {"$sort": {"count": -1}}
        ]

        # Run the query
        results = [doc async for doc in db.clubs.aggregate(query)]

        # Build response
        return [
            {
                "geolocation": {
                    "city": doc["sample_geo"].get("city"),
                    "country": doc["sample_geo"].get("country"),
                    "latitude": doc["sample_geo"].get("latitude"),
                    "longitude": doc["sample_geo"].get("longitude"),
                },
                "count": doc["count"]
            }
            for doc in results if doc["_id"]  # skip null group keys
        ]

    get_user_count_per_geolocation = List(CountPerGeolocationType, geographic=String(), has_club=Boolean())

    async def resolve_get_user_count_per_geolocation(self, info, geographic="city", has_club=False):
        db = info.context["db"]

        # Validate geographic argument
        if geographic not in ("city", "country"):
            raise ValueError("Invalid geographic argument. Must be 'city' or 'country'.")

        query = []

        if has_club:
            # Only include users who are owners of at least one club
            query.append({
                "$lookup": {
                    "from": "clubs",
                    "localField": "_id",
                    "foreignField": "owner",
                    "as": "owned_clubs"
                }
            })
            query.append({
                "$match": {
                    "owned_clubs.0": {"$exists": True}  # user owns at least 1 club
                }
            })

        # Join with geolocations
        query += [
            {
                "$lookup": {
                    "from": "geolocations",
                    "localField": "geolocation",
                    "foreignField": "_id",
                    "as": "geolocation_info"
                }
            },
            {"$unwind": "$geolocation_info"},
            {
                "$group": {
                    "_id": f"$geolocation_info.{geographic}",
                    "count": {"$sum": 1},
                    "sample_geo": {"$first": "$geolocation_info"}
                }
            },
            {"$sort": {"count": -1}}
        ]

        results = [doc async for doc in db.users.aggregate(query)]

        return [
            {
                "geolocation": {
                    "city": doc["sample_geo"].get("city"),
                    "country": doc["sample_geo"].get("country"),
                    "latitude": doc["sample_geo"].get("latitude"),
                    "longitude": doc["sample_geo"].get("longitude"),
                },
                "count": doc["count"]
            }
            for doc in results if doc["_id"]
        ]

    get_player_count = Int(
        exclude_mfl_players=Boolean(),
        min_ovr=Int(), max_ovr=Int(),
        min_age=Int(), max_age=Int(),
        min_pace=Int(), max_pace=Int(),
        min_dribbling=Int(), max_dribbling=Int(),
        min_passing=Int(), max_passing=Int(),
        min_shooting=Int(), max_shooting=Int(),
        min_defense=Int(), max_defense=Int(),
        min_physical=Int(), max_physical=Int(),
        min_height=Int(), max_height=Int(),
        nationalities=List(String),
        positions=List(String),
        first_position_only=Boolean(),
        preferred_foot=List(String),
        )

    async def resolve_get_player_count(self, info,
        exclude_mfl_players=True,
        min_ovr=1, max_ovr=100,
        min_age=1, max_age=100,
        min_height=1, max_height=300,
        min_pace=1, max_pace=100,
        min_dribbling=1, max_dribbling=100,
        min_passing=1, max_passing=100,
        min_shooting=1, max_shooting=100,
        min_defense=1, max_defense=100,
        min_physical=1, max_physical=100,
        nationalities=None,
        positions=None,
        first_position_only=False,
        preferred_foot=None
        ):
        query = []

        player_match = {"$match": {}}

        player_match["$match"]["overall"] = {"$gte": min_ovr, "$lte": max_ovr}
        player_match["$match"]["age"] = {"$gte": min_age, "$lte": max_age}
        player_match["$match"]["height"] = {"$gte": min_height, "$lte": max_height}
        player_match["$match"]["pace"] = {"$gte": min_pace, "$lte": max_pace}
        player_match["$match"]["dribbling"] = {"$gte": min_dribbling, "$lte": max_dribbling}
        player_match["$match"]["passing"] = {"$gte": min_passing, "$lte": max_passing}
        player_match["$match"]["shooting"] = {"$gte": min_shooting, "$lte": max_shooting}
        player_match["$match"]["defense"] = {"$gte": min_defense, "$lte": max_defense}
        player_match["$match"]["physical"] = {"$gte": min_physical, "$lte": max_physical}

        if nationalities and len(nationalities) > 0:
            player_match["$match"]["nationalities"] = {"$in": nationalities}
        if positions and len(positions) > 0:
            if first_position_only:
                player_match["$match"]["positions.0"] = {"$in": positions}
            else:
                player_match["$match"]["positions"] = {"$in": positions}
        if preferred_foot:
            player_match["$match"]["preferred_foot"] = {"$in": preferred_foot}

        query.append(player_match)

        if exclude_mfl_players:
            query.append({
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            })
            query.append({
                "$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}
            })

        query.append({"$count": "count"})

        return [c["count"] async for c in info.context["db"].players.aggregate(query)][0]

    get_player_count_by_criteria = List(CountType,
        criteria=String(),
        exclude_mfl_players=Boolean(),
        min_ovr=Int(), max_ovr=Int(),
        min_age=Int(), max_age=Int(),
        min_height=Int(), max_height=Int(),
        min_pace=Int(), max_pace=Int(),
        min_dribbling=Int(), max_dribbling=Int(),
        min_passing=Int(), max_passing=Int(),
        min_shooting=Int(), max_shooting=Int(),
        min_defense=Int(), max_defense=Int(),
        min_physical=Int(), max_physical=Int(),
        nationalities=List(String),
        positions=List(String),
        first_position_only=Boolean(),
        preferred_foot=List(String),
        )

    async def resolve_get_player_count_by_criteria(self, info,
        criteria=None,
        exclude_mfl_players=True,
        min_ovr=1, max_ovr=100,
        min_age=1, max_age=100,
        min_height=1, max_height=300,
        min_pace=1, max_pace=100,
        min_dribbling=1, max_dribbling=100,
        min_passing=1, max_passing=100,
        min_shooting=1, max_shooting=100,
        min_defense=1, max_defense=100,
        min_physical=1, max_physical=100,
        nationalities=None,
        positions=None,
        first_position_only=False,
        preferred_foot=None
        ):
        query = []

        match_stage = {"$match": {}}

        if exclude_mfl_players:
            query.append({
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            })
            match_stage["$match"]["owner_info.address"] = {"$ne": "0xf45dfaa6233fae44"}

        match_stage["$match"]["overall"] = {"$gte": min_ovr, "$lte": max_ovr}
        match_stage["$match"]["age"] = {"$gte": min_age, "$lte": max_age}
        match_stage["$match"]["height"] = {"$gte": min_height, "$lte": max_height}
        match_stage["$match"]["pace"] = {"$gte": min_pace, "$lte": max_pace}
        match_stage["$match"]["dribbling"] = {"$gte": min_dribbling, "$lte": max_dribbling}
        match_stage["$match"]["passing"] = {"$gte": min_passing, "$lte": max_passing}
        match_stage["$match"]["shooting"] = {"$gte": min_shooting, "$lte": max_shooting}
        match_stage["$match"]["defense"] = {"$gte": min_defense, "$lte": max_defense}
        match_stage["$match"]["physical"] = {"$gte": min_physical, "$lte": max_physical}

        if nationalities:
            match_stage["$match"]["nationalities"] = {"$in": nationalities}
        if positions:
            if first_position_only:
                match_stage["$match"]["positions.0"] = {"$in": positions}
            else:
                match_stage["$match"]["positions"] = {"$in": positions}
        if preferred_foot:
            match_stage["$match"]["preferred_foot"] = {"$in": preferred_foot}

        c = None

        if criteria == "OVR":
            c = "$overall"
        elif criteria == "AGE":
            c = "$age"
        elif criteria == "POS":
            c = {"$arrayElemAt": ["$positions", 0]}
        elif criteria == "NAT":
            c = {"$arrayElemAt": ["$nationalities", 0]}
        elif criteria == "FOOT":
            c = "$preferred_foot"
        elif criteria == "PAC":
            c = "$pace"
        elif criteria == "DRI":
            c = "$dribbling"
        elif criteria == "PAS":
            c = "$passing"
        elif criteria == "SHO":
            c = "$shooting"
        elif criteria == "DEF":
            c = "$defense"
        elif criteria == "PHY":
            c = "$physical"
        elif criteria == "HEI":
            c = "$height"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Criteria parameter must be one of: OVR, AGE, POS, NAT, FOOT, PAC, DRI, PAS, SHO, DEF, PHY, HEI",
            )

        query.append(match_stage)
        query.append({
            "$group": {
                "_id": c,
                "count": {"$sum": 1}
            }
        })

        return [CountType(key=c["_id"], count=c["count"]) async for c in info.context["db"].players.aggregate(query)]

    get_player_count_per_country = List(CountType, owners=List(String))

    async def resolve_get_player_count_per_country(self, info, owners=None):
        filters = {}

        if owners is not None:
            filters["owner"] = {"$in": [ObjectId(o) for o in owners]}

        pipeline = [
            {"$match": filters},
            {"$unwind": "$nationalities"},
            {"$group": {"_id": "$nationalities", "count": {"$sum": 1}}},
        ]

        results = await info.context["db"].players \
            .aggregate(pipeline) \
            .to_list(length=None)
    
        return [CountType(key=res["_id"], count=res["count"]) for res in results]

    get_player_owner_count = Int()

    async def resolve_get_player_owner_count(self, info):
        return len(await info.context["db"].players.distinct('owner')) - 1

    get_clubs_per_owner_counts = List(CountType, founded_only=Boolean())

    get_club_division_counts = List(CountType, founded_only=Boolean())

    async def resolve_get_club_division_counts(self, info, founded_only=True):
        query = [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            },
            {"$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}},
            {"$group": {"_id": "$division", "count": {"$sum": 1}}}
        ]

        if founded_only:
            query.insert(0, {"$match": {"status": "FOUNDED"}})

        cursor = info.context["db"].clubs.aggregate(query)

        return [CountType(key=c["_id"], count=c["count"]) async for c in cursor]

    get_club_owner_count = Int()

    async def resolve_get_club_owner_count(self, info):
        return len(await info.context["db"].clubs.distinct('owner')) - 1

    get_clubs_per_owner_counts = List(CountType, founded_only=Boolean())

    async def resolve_get_clubs_per_owner_counts(self, info, founded_only=True):
        query = [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            },
            {"$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}},
            {"$group": {"_id": "$owner", "count": {"$sum": 1}}},
            {"$group": {"_id": "$count", "count": {"$sum": 1}}}
        ]

        if founded_only:
            query.insert(0, {"$match": {"status": "FOUNDED"}})

        cursor = info.context["db"].clubs.aggregate(query)

        return [CountType(key=c["_id"], count=c["count"]) async for c in cursor]

    get_data_points = List(DataPointType, property=String())

    async def resolve_get_data_points(self, info, property):
        return await info.context["db"].data_points \
            .find({"property": property}) \
            .to_list(length=None)

    get_teams = List(TeamType)

    @require_token
    async def resolve_get_teams(self, info):
        return await info.context["db"].teams \
            .find({"user": info.context["user"]["_id"]}) \
            .to_list(length=None)

    get_team_members = List(TeamMemberType, team=String())

    @require_token
    async def resolve_get_team_members(self, info, team=None):
        team = await info.context["db"].teams.find_one({"_id": ObjectId(team)})

        if not team:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, # to change to 404
                detail="Team not found",
            )

        if info.context["user"]["_id"] != team["user"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="This user does not have access to this team",
            )

        team_members = await info.context["db"].team_members \
            .find({"team": ObjectId(team["_id"])}) \
            .to_list(length=None)

        return team_members

    get_players = List(PlayerType,
        search=String(),
        owners=List(String),
        min_ovr=Int(), max_ovr=Int(),
        min_age=Int(), max_age=Int(),
        min_height=Int(), max_height=Int(),
        min_pace=Int(), max_pace=Int(),
        min_dribbling=Int(), max_dribbling=Int(),
        min_passing=Int(), max_passing=Int(),
        min_shooting=Int(), max_shooting=Int(),
        min_defense=Int(), max_defense=Int(),
        min_physical=Int(), max_physical=Int(),
        nationalities=List(String),
        positions=List(String),
        first_position_only=Boolean(),
        preferred_foot=List(String),
        ignore_players_in_teams=Boolean(),
        skip=Int(), limit=Int(),
        sort=String(), order=Int()
        )

    @add_token_if_exists
    async def resolve_get_players(self, info,
        search=None,
        owners=None,
        min_ovr=1, max_ovr=100,
        min_age=1, max_age=100,
        min_height=1, max_height=300,
        min_pace=1, max_pace=100,
        min_dribbling=1, max_dribbling=100,
        min_passing=1, max_passing=100,
        min_shooting=1, max_shooting=100,
        min_defense=1, max_defense=100,
        min_physical=1, max_physical=100,
        nationalities=None,
        positions=None,
        first_position_only=False,
        preferred_foot=None,
        ignore_players_in_teams=False,
        skip=0, limit=50000,
        sort="overall", order=-1):

        filters = {}

        if min_ovr != 1 or max_ovr != 100:
            filters["overall"] = {"$gte": min_ovr, "$lte": max_ovr}
        if min_age != 1 or max_age != 100:
            filters["age"] = {"$gte": min_age, "$lte": max_age}
        if min_height != 1 or max_height != 300:
            filters["height"] = {"$gte": min_height, "$lte": max_height}
        if min_pace != 1 or max_pace != 100:
            filters["pace"] = {"$gte": min_pace, "$lte": max_pace}
        if min_dribbling != 1 or max_dribbling != 100:
            filters["dribbling"] = {"$gte": min_dribbling, "$lte": max_dribbling}
        if min_passing != 1 or max_passing != 100:
            filters["passing"] = {"$gte": min_passing, "$lte": max_passing}
        if min_shooting != 1 or max_shooting != 100:
            filters["shooting"] = {"$gte": min_shooting, "$lte": max_shooting}
        if min_defense != 1 or max_defense != 100:
            filters["defense"] = {"$gte": min_defense, "$lte": max_defense}
        if min_physical != 1 or max_physical != 100:
            filters["physical"] = {"$gte": min_physical, "$lte": max_physical}
        if nationalities is not None and len(nationalities) > 0:
            filters["nationalities"] = {"$in": nationalities}
        if positions is not None and len(positions) > 0:
            if first_position_only:
                filters["positions.0"] = {"$in": positions}
            else:
                filters["positions"] = {"$in": positions}
        if preferred_foot is not None and len(preferred_foot) > 0:
            filters["preferred_foot"] = {"$in": preferred_foot}
        if owners is not None:
            filters["owner"] = {"$in": [ObjectId(o) for o in owners]}

        if search:
            words = [] if search is None else [w for w in search.split(" ") if len(w) > 1]

            regex_query = {
                "$and": [
                    {
                        "$or": [
                            {"first_name": {"$regex": word, "$options": "i"}},
                            {"last_name": {"$regex": word, "$options": "i"}},
                        ]
                    }
                    for word in words
                ]
            }

            filters = {
                "$and": [
                    filters,
                    regex_query
                ]
            }

        if ignore_players_in_teams:
            if "user" in info.context and "_id" in info.context["user"]:
                user_team_ids = await info.context["db"].teams.find({"user": ObjectId(info.context["user"]["_id"])}).distinct("_id")
                player_ids = await info.context["db"].team_members.find({"team": {"$in": user_team_ids}}).distinct("player")

                if len(player_ids) > 0:
                    filters["_id"] = {"$nin": player_ids}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User not found. Impossible to use 'ignore_players_in_teams'",
                )

        players = await info.context["db"].players \
            .find(filters) \
            .sort(sort, -1 if order < 0 else 1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return players

    get_contracts = List(ContractType, min_ovr=Int(), max_ovr=Int(), nationalities=List(String), positions=List(String), first_position_only=Boolean())

    async def resolve_get_contracts(self, info, min_ovr=1, max_ovr=100, nationalities=None, positions=None, first_position_only=False):

        player_filters = {
            "overall": {"$gte": min_ovr, "$lte": max_ovr}
        }

        if nationalities is not None:
            player_filters["nationalities"] = {"$in": nationalities}
        if positions is not None:
            if first_position_only:
                player_filters["positions.0"] = {"$in": positions}
            else:
                player_filters["positions"] = {"$in": positions}

        matching_players = await info.context["db"].players.find(player_filters).to_list(None)
        matching_player_ids = [player["_id"] for player in matching_players]

        contracts = await info.context["db"].contracts \
            .find({"player": {"$in": matching_player_ids}}) \
            .to_list(None)

        return contracts

    get_player_nationalities = List(String)

    async def resolve_get_player_nationalities(self, info):

        pipeline = [
            { "$unwind": "$nationalities" },
            { "$group": { "_id": "$nationalities" } },
            { "$sort": { "_id": 1 } }
        ]

        result = info.context["db"].players.aggregate(pipeline)

        return [doc["_id"] async for doc in result]

    get_users = List(UserType, search=String(), skip=Int(), limit=Int(), sort=String(), order=Int())

    async def resolve_get_users(self, info, search=None, skip=0, limit=10, sort="_id", order=1):

        users = info.context["db"].users

        if search:
            words = [] if search is None else [w for w in search.split(" ") if len(w) > 1]

            regex_query = {
                "$and": [
                    {
                        "$or": [
                            {"address": {"$regex": word, "$options": "i"}},
                            {"name": {"$regex": word, "$options": "i"}},
                        ]
                    }
                    for word in words
                ]
            }

            users = users.find(regex_query)

        users = await users \
            .sort(sort, -1 if order < 0 else 1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return users

    get_player_pricings = List(PlayerPricingType)

    async def resolve_get_player_pricings(self, info):
        return await info.context["db"].player_pricings \
            .find() \
            .to_list(length=None)

    get_raw_player_pricings = List(RawPlayerPricingType)

    async def resolve_get_raw_player_pricings(self, info):
        lookback_date = datetime.now() - timedelta(days=30)

        pipeline = [
            {"$match": {
                "date": {"$gte": lookback_date, "$lte": datetime.now()}
            }},
            {"$sort": {"date": -1}},
            {"$group": {
                "_id": {"age": "$age", "overall": "$overall", "position": "$position"},
                "price": {"$first": "$price"},
                "date": {"$first": "$date"},
            }},
        ]

        raw_results = await info.context["db"] \
        .raw_player_pricings.aggregate(pipeline) \
        .to_list(length=None)

        flattened_results = [
            {
                "age": doc["_id"]["age"],
                "overall": doc["_id"]["overall"],
                "position": doc["_id"]["position"],
                "price": doc["price"],
                "date": doc["date"],
            }
            for doc in raw_results
        ]

        return flattened_results
