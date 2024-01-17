from graphene import ObjectType, String, Int, Field, List, Enum, ID, DateTime
import enum
import uuid
from bson import ObjectId

class DefaultStatusEnum(enum.Enum):
    ACTIVE = "active"
    DELETED = "deleted"

class NotificationScopeTypeEnum(enum.Enum):
    LISTING = "listing"
    CONTRACT = "contract"
    SALE = "sale"

class UserType(ObjectType):
    id = ID(source='_id')
    address = String()
    email = String()
    is_email_confirmed = bool()

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
        notification_scope_id = str(self.id)
        notifications = await info.context["db"].notifications \
            .find({"notification_scope": ObjectId(notification_scope_id)}) \
            .to_list(None)
        return notifications

    async def resolve_user(self, info):
        user = await info.context["db"].users.find_one({"_id": self["user"]})
        return user

class NotificationType(ObjectType):
    id = ID(source='_id')
    status = String()
    player_ids = List(lambda: Int())
    creation_date = DateTime()
    sending_date = DateTime()
    notification_scope = Field(NotificationScopeType)

    async def resolve_notification_scope(self, info):
        notification_scope = await info.context["db"].notification_scopes \
            .find_one({"_id": self["notification_scope"]})
        return notification_scope
