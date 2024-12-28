from graphene import ObjectType, String, Int, Boolean, Field, List, ID, DateTime, Float
import enum
from bson import ObjectId


class DefaultStatusEnum(enum.Enum):
    ACTIVE = "active"
    DELETED = "deleted"


class NotificationScopeTypeEnum(enum.Enum):
    LISTING = "listing"
    CONTRACT = "contract"
    SALE = "sale"


class ReportTypeEnum(enum.Enum):
    DAILY_PROGRESS_REPORT = "daily_progress_report"


class ClubStatusEnum(enum.Enum):
    FOUNDED = "FOUNDED"
    NOT_FOUNDED = "NOT_FOUNDED"


class SaleTypeEnum(enum.Enum):
    PLAYER = "PLAYER"
    CLUB = "CLUB"


class PlayerCriteriaTypeEnum(enum.Enum):
    AGE = "AGE"
    OVR = "OVR"
    POS = "POS"
    NAT = "NAT"


class UserType(ObjectType):
    id = ID(source='_id')
    address = String()
    email = String()
    name = String()
    confirmation_code = String()
    is_email_confirmed = Boolean()


class PlayerType(ObjectType):
    id = Int(source='_id')
    first_name = String()
    last_name = String()
    overall = Int()
    nationalities = List(String)
    positions = List(String)
    height = Int()
    preferred_foot = String()
    age = Int()
    pace = Int()
    shooting = Int()
    passing = Int()
    dribbling = Int()
    defense = Int()
    physical = Int()
    goalkeeping = Int()
    resistance = Int()
    owner = Field(UserType)


class ClubType(ObjectType):
    id = Int(source='_id')
    status = String()
    name = String()
    division = Int()
    city = String()
    country = String()
    foundation_date = DateTime()
    last_computation_date = DateTime()
    owner = Field(UserType)


class ContractType(ObjectType):
    id = Int(source='_id')
    status = String()
    revenue_share = Int()
    total_revenue_share_locked = Int()
    start_season = Int()
    number_of_season = Int()
    auto_renewal = Boolean()
    creation_date = DateTime()
    last_computation_date = DateTime()
    player = Field(PlayerType)
    club = Field(ClubType)

    async def resolve_player(self, info):
        return await info.context["db"].players.find_one({"_id": self["player"]})

    async def resolve_club(self, info):
        return await info.context["db"].clubs.find_one({"_id": self["club"]})


class SaleType(ObjectType):
    id = Int(source='_id')
    price = Float()
    execution_date = DateTime()
    player = Field(PlayerType)
    club = Field(ClubType)
    overall = Int()
    positions = List(String)
    division = Int()
    age = Int()

    async def resolve_player(self, info):
        return await info.context["db"].players.find_one({"_id": self["player"]})

    async def resolve_club(self, info):
        return await info.context["db"].clubs.find_one({"_id": self["club"]})


class TeamType(ObjectType):
    id = ID(source='_id')
    name = String()
    formation = String()
    is_public = Boolean()
    user = Field(UserType)


class TeamMemberType(ObjectType):
    id = ID(source='_id')
    team = Field(TeamType)
    player = Field(PlayerType)
    position = Int()

    async def resolve_team(self, info):
        team = await info.context["db"].teams.find_one({"_id": self["team"]})
        return team

    async def resolve_player(self, info):
        player = await info.context["db"].players.find_one({"_id": self["player"]})
        return player


class CountType(ObjectType):
    key = String()
    count = Int()


class DataPointType(ObjectType):
    property = String()
    date = String()
    value = Float()


class NotificationScopeType(ObjectType):
    id = ID(source='_id')
    type = String() # Enum.from_enum(NotificationScopeTypeEnum)
    positions = List(lambda: String())
    nationalities = List(lambda: String())
    min_price = Int()
    max_price = Int()
    min_age = Int()
    max_age = Int()
    min_ovr = Int()
    max_ovr = Int()
    min_pac = Int()
    max_pac = Int()
    min_dri = Int()
    max_dri = Int()
    min_pas = Int()
    max_pas = Int()
    min_sho = Int()
    max_sho = Int()
    min_def = Int()
    max_def = Int()
    min_phy = Int()
    max_phy = Int()
    creation_date = DateTime()
    last_computation_date = DateTime()
    user = Field(UserType)
    notifications = List(lambda: NotificationType)

    async def resolve_notifications(self, info):
        return await info.context["db"].notifications \
            .find({"notification_scope": ObjectId(str(self.id))}) \
            .to_list(None)

    async def resolve_user(self, info):
        return await info.context["db"].users.find_one({"_id": self["user"]})


class NotificationType(ObjectType):
    id = ID(source='_id')
    status = String()
    player_ids = List(lambda: Int())
    creation_date = DateTime()
    sending_date = DateTime()
    notification_scope = Field(NotificationScopeType)

    async def resolve_notification_scope(self, info):
        return await info.context["db"].notification_scopes.find_one({"_id": self["notification_scope"]})


class ReportConfigurationType(ObjectType):
    id = ID(source='_id')
    type = String() # Enum.from_enum(ReportConfigurationTypeEnum)
    positions = List(lambda: String())
    time = String()
    creation_date = DateTime()
    last_computation_date = DateTime()
    user = Field(UserType)
    reports = List(lambda: ReportType)

    async def resolve_reports(self, info):
        return await info.context["db"].reports \
            .find({"report": ObjectId(str(self.id))}) \
            .to_list(None)

    async def resolve_user(self, info):
        return await info.context["db"].users.find_one({"_id": self["user"]})


class ReportType(ObjectType):
    id = ID(source='_id')
    status = String()
    creation_date = DateTime()
    sending_date = DateTime()
    report_configuration = Field(ReportConfigurationType)

    async def resolve_notification_scope(self, info):
        return await info.context["db"].report_configurations.find_one({"_id": self["report_configuration"]})


class NonceType(ObjectType):
    id = ID(source='_id')
    address = String()
    nonce = String()
