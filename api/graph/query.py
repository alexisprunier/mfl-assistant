from graphene import ObjectType, String, Int, Schema, Field, List, ID, Boolean, Date
from graph.schema import MatchType, ClubNotificationScopeType, MatchClubPairType, RawPlayerPricingType, FormationMetaType, PlayerPricingType, UserType, GeolocationType, SaleType, ContractType, NotificationScopeType, NotificationType, CountType, DataPointType, ClubType, TeamType, TeamMemberType, PlayerType, ReportConfigurationType, ReportType
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

    get_club_notification_scopes = List(ClubNotificationScopeType)

    @require_token
    async def resolve_get_club_notification_scopes(self, info):
        return await info.context["db"].club_notification_scopes \
            .find({"user": info.context["user"]["_id"]}) \
            .to_list(length=None)

    get_notifications = List(NotificationType, notification_scope=String(), club_notification_scope=String(), type=String(), skip=Int(), limit=Int(), sort=String(), order=Int())

    @require_token
    async def resolve_get_notifications(self, info, notification_scope=None, club_notification_scope=None, type=None, skip=0, limit=10, sort="_id", order=1):

        notification_scopes = []
        club_notification_scopes = []

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

        if club_notification_scope:
            club_notification_scope = await info.context["db"].club_notification_scopes \
                .find_one({"_id": ObjectId(club_notification_scope)})

            if not club_notification_scope:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, # to change to 404
                    detail="Club notification scope not found",
                )

            if info.context["user"]["_id"] != club_notification_scope["user"]:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="This user does not have access to this club notification scope",
                )

            club_notification_scopes = [club_notification_scope]

        if not notification_scope and not club_notification_scope:
            notification_scopes = await info.context["db"].notification_scopes \
                .find({"user": info.context["user"]["_id"]}) \
                .to_list(length=None)
            club_notification_scopes = await info.context["db"].club_notification_scopes \
                .find({"user": info.context["user"]["_id"]}) \
                .to_list(length=None)

        notification_scope_ids = [s["_id"] for s in notification_scopes]
        club_notification_scope_ids = [s["_id"] for s in club_notification_scopes]

        query = {}

        if type == "player":
            if notification_scope_ids:
                query["notification_scope"] = {
                    "$in": notification_scope_ids,
                    "$ne": None
                }
            else:
                return []

        elif type == "club":
            if club_notification_scope:
                query["club_notification_scope"] = ObjectId(club_notification_scope)
            else:
                query["club_notification_scope"] = {"$ne": None}

        else:
            if notification_scope_ids:
                query["notification_scope"] = {"$in": notification_scope_ids}
            else:
                return []

        notifications = await info.context["db"].notifications \
            .find(query) \
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

    get_clubs = List(
        ClubType,
        search=String(),
        include_mfl=Boolean(),
        owners=List(String),
        city=String(),
        country=String(),
        founded_only=Boolean(),
        skip=Int(),
        limit=Int(),
        sort=String(),
        order=Int()
    )

    async def resolve_get_clubs(self, info, search=None, include_mfl=False, owners=None, city=None, country=None, founded_only=False, skip=0, limit=500, sort="_id", order=1):

        clubs = info.context["db"].clubs
        
        filters = {}

        if not include_mfl:
            excluded_user = await info.context["db"].users.find_one(
                {"address": "0xf45dfaa6233fae44"},
                {"_id": 1}
            )

            if excluded_user:
                filters["owner"] = {"$ne": excluded_user["_id"]}

        if owners is not None:
            filters["owner"] = {"$in": [ObjectId(o) for o in owners]}

        if city is not None:
            filters["city"] = city  # exact match

        if country is not None:
            filters["country"] = country  # exact match

        if founded_only:
            filters["status"] = "FOUNDED"

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

        sales_collection = info.context["db"].sales

        filters = {}

        if type == "PLAYER":
            filters = {
                "player": {"$exists": True, "$ne": None},
                "overall": {"$gte": min_ovr, "$lte": max_ovr},
                "age": {"$gte": min_age, "$lte": max_age},
            }

            if positions:
                if first_position_only:
                    filters["positions.0"] = {"$in": positions}
                else:
                    filters["positions"] = {"$in": positions}

        elif type == "CLUB":
            filters = {
                "club": {"$exists": True, "$ne": None},
            }

        # Add execution_date filters if any
        execution_date_filter = {}
        if min_date:
            execution_date_filter["$gte"] = min_date
        if max_date:
            execution_date_filter["$lte"] = max_date
        if execution_date_filter:
            filters["execution_date"] = execution_date_filter

        # Build the cursor
        cursor = (
            sales_collection
            .find(filters)
            .sort(sort, order)
            .skip(skip)
            .limit(limit)
        )

        sales = await cursor.to_list(length=None)
        return sales

    get_club_count = Int(
        founded_only=Boolean(),
        include_mfl=Boolean()
    )

    async def resolve_get_club_count(self, info, founded_only=False, include_mfl=False):
        query = [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner_info"
                }
            }
        ]

        if founded_only:
            query.append({"$match": {"status": "FOUNDED"}})

        if not include_mfl:
            query.append({"$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}})

        query.append({"$count": "count"})

        result = [c["count"] async for c in info.context["db"].clubs.aggregate(query)]
        return result[0] if result else 0

    class CountPerGeolocationType(ObjectType):
        count = Int()
        geolocation = Field(GeolocationType)

    get_club_count_per_geolocation = List(CountPerGeolocationType, founded_only=Boolean(), geographic=String(), include_mfl=Boolean())

    async def resolve_get_club_count_per_geolocation(self, info, founded_only=False, geographic="city", include_mfl=False):
        db = info.context["db"]

        if geographic not in ("city", "country"):
            raise ValueError("Invalid geographic argument. Must be 'city' or 'country'.")

        query = []

        if founded_only:
            query.append({"$match": {"status": "FOUNDED"}})

        # Lookup user info
        query.append({
            "$lookup": {
                "from": "users",
                "localField": "owner",
                "foreignField": "_id",
                "as": "owner_info"
            }
        })

        # Optional filter based on address

        if not include_mfl:
            query.append({
                "$match": {"owner_info.address": {"$ne": "0xf45dfaa6233fae44"}}
            })

        # Lookup geolocation info and group
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

        results = [doc async for doc in db.clubs.aggregate(query)]

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

    get_user_count_per_geolocation = List(CountPerGeolocationType, geographic=String(), has_club=Boolean())

    async def resolve_get_user_count_per_geolocation(self, info, geographic="city", has_club=False):
        db = info.context["db"]

        if geographic not in ("city", "country"):
            raise ValueError("Invalid geographic argument. Must be 'city' or 'country'.")

        query = []

        if has_club:
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
                    "owned_clubs.0": {"$exists": True}
                }
            })

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
        if positions is None or "GK" not in positions:
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
        if positions is None or "GK" not in positions:
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

    async def resolve_get_club_division_counts(self, info, founded_only=False):
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

    async def resolve_get_clubs_per_owner_counts(self, info, founded_only=False):
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

    get_club_countries = List(String)

    async def resolve_get_club_countries(self, info):

        pipeline = [
            { "$match": { "country": { "$ne": None } } },
            { "$group": { "_id": "$country" } },
            { "$sort": { "_id": 1 } }
        ]

        result = info.context["db"].clubs.aggregate(pipeline)

        return [doc["_id"] async for doc in result]

    get_club_cities = List(String)

    async def resolve_get_club_cities(self, info):

        pipeline = [
            { "$match": { "city": { "$ne": None } } },
            { "$group": { "_id": "$city" } },
            { "$sort": { "_id": 1 } }
        ]

        result = info.context["db"].clubs.aggregate(pipeline)

        return [doc["_id"] async for doc in result]

    get_users = List(UserType, search=String(), country=String(), city=String(), has_club=Boolean(), skip=Int(), limit=Int(), sort=String(), order=Int())

    async def resolve_get_users(self, info, search=None, country=None, city=None, has_club=None, skip=0, limit=10, sort="_id", order=1):
        users = info.context["db"].users
        clubs = info.context["db"].clubs  # Reference to the clubs collection

        query_conditions = []

        # Handle search filtering
        if search:
            words = [w for w in search.split(" ") if len(w) > 1]

            if words:
                regex_query = {
                    "$and": [
                        {
                            "$or": [
                                {"address": {"$regex": word, "$options": "i"}},
                                {"name": {"$regex": word, "$options": "i"}},
                            ]
                        } for word in words
                    ]
                }
                query_conditions.append(regex_query)

        # Handle city filtering
        if city:
            query_conditions.append({"city": city})

        # Handle country filtering
        if country:
            query_conditions.append({"country": country})

        # Handle has_club filtering
        if has_club is not None:
            if has_club:  # If true, find users who are owners of at least one club
                # Query for users who are owners of any club
                owner_query = clubs.find({"owner": {"$ne": None}})
                owner_user_ids = [club['owner'] for club in await owner_query.to_list(length=None)]
                query_conditions.append({"_id": {"$in": owner_user_ids}})
            else:
                # Users who are NOT owners of any club (assuming that no owner is `None`)
                query_conditions.append({"_id": {"$nin": []}})  # You can adjust this as needed for the logic

        # Apply all conditions if any are provided
        if query_conditions:
            users = users.find({"$and": query_conditions})

        # Sort, skip, and limit the results
        users = await users \
            .sort(sort, -1 if order < 0 else 1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(length=None)

        return users

    get_player_pricings = List(PlayerPricingType)

    async def resolve_get_player_pricings(self, info):
        db = info.context["db"].player_pricings
    
        latest_doc = await db.find().sort("date", -1).limit(1).to_list(length=1)
        
        if not latest_doc:
            return []
        
        latest_date = latest_doc[0]["date"]
        
        return await db.find({"date": latest_date}).to_list(length=None)

    get_player_pricing_history = List(
        PlayerPricingType,
        overall=Int(required=True),
        position=String(required=True),
        age=Int(required=True)
    )

    async def resolve_get_player_pricing_history(self, info, overall, position, age):
        db = info.context["db"].player_pricings
        
        query = {
            "overall": overall,
            "position": position,
            "age": age
        }
        
        cursor = db.find(query).sort("date", 1)
        
        return await cursor.to_list(length=None)

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

    get_formation_metas = List(FormationMetaType, engine=String(required=True))

    async def resolve_get_formation_metas(self, info, engine):

        query = {
            "engine": engine
        }

        result = [
            item async for item in info.context["db"].formation_metas.find(query)
        ]

        return result

    get_formation_meta_engines = List(String)

    async def resolve_get_formation_meta_engines(self, info):

        pipeline = [
            {
                "$group": {
                    "_id": "$engine"
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "engine": "$_id"
                }
            }
        ]
        
        result = [
            item["engine"] async for item in info.context["db"].formation_metas.aggregate(pipeline)
        ]
        
        return result

    get_opponents = List(
        MatchType,
        formation=String(),
        minOvr=Int(),
        maxOvr=Int(),
        skip=Int(default_value=0),
        limit=Int(default_value=20)
    )

    async def resolve_get_opponents(
        self,
        info,
        formation=None,
        minOvr=None,
        maxOvr=None,
        skip=0,
        limit=10
    ):
        def sanitize_datetime(date_str):
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))

        db = info.context["db"]

        match_filter = {
            "type": "FRIENDLY",
            "homeClub": {"$exists": True, "$ne": None},
            "awayClub": {"$exists": True, "$ne": None},
            "homeOverall": {"$exists": True, "$ne": None},
            "awayOverall": {"$exists": True, "$ne": None},
        }

        ovr_filter = {}
        if minOvr is not None:
            ovr_filter["$gte"] = minOvr
        if maxOvr is not None:
            ovr_filter["$lte"] = maxOvr

        home_conditions = []
        away_conditions = []

        if formation:
            home_conditions.append({"homeFormation": formation})
            away_conditions.append({"awayFormation": formation})

        if ovr_filter:
            home_conditions.append({"homeOverall": ovr_filter})
            away_conditions.append({"awayOverall": ovr_filter})

        if home_conditions or away_conditions:
            match_filter["$or"] = []
            if home_conditions:
                match_filter["$or"].append({"$and": home_conditions})
            if away_conditions:
                match_filter["$or"].append({"$and": away_conditions})

        matches_cursor = db.matches.find(
            match_filter,
            sort=[("startDate", -1)],
            skip=skip,
            limit=limit
        )
        matches = await matches_cursor.to_list(length=None)

        for match in matches:
            if "startDate" in match:
                match["startDate"] = sanitize_datetime(match["startDate"])

        return matches

    get_matches = List(
        MatchType,
        clubs=List(Int),
        types=List(String),
        statuses=List(String),
        skip=Int(default_value=0),
        limit=Int(default_value=20)
    )

    async def resolve_get_matches(
        self,
        info,
        clubs=None,
        types=None,
        statuses=None,
        skip=0,
        limit=20
    ):
        def sanitize_datetime(date_str):
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))

        db = info.context["db"]

        match_filter = {
            "homeClub": {"$exists": True, "$ne": None},
            "awayClub": {"$exists": True, "$ne": None},
        }

        if clubs:
            match_filter["$or"] = [
                {"homeClub": {"$in": clubs}},
                {"awayClub": {"$in": clubs}}
            ]

        if types:
            match_filter["type"] = {"$in": types}

        if statuses:
            match_filter["status"] = {"$in": statuses}

        matches_cursor = db.matches.find(
            match_filter,
            sort=[("startDate", -1)],
            skip=skip,
            limit=limit
        )

        matches = await matches_cursor.to_list(length=None)

        for match in matches:
            if "startDate" in match:
                match["startDate"] = sanitize_datetime(match["startDate"])

        return matches