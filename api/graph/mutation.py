from graphene import Mutation, ObjectType, InputObjectType, String, Argument, Int, Schema, Field, List, Enum
from graph.schema import UserType, NotificationScopeType, NotificationType, NotificationScopeTypeEnum

def build_error(code):
    return {
        "errors": [
            {
                "code": code,
                "message": "object of type 'AsyncIOMotorCursor' has no len()",
            } 
        ]
    }


class AddUser(Mutation):
    class Arguments:
        address = String(required=True)

    user = Field(lambda: UserType)

    async def mutate(self, info, address):
        cursor = info.context["db"].users.find({"address": { "$eq": address }})
        users = await cursor.to_list(length=1)

        if len(users) > 0:
            return build_error(502)

        user = info.context["db"].users.insert_one({"address": address})
        user = UserType({"address": address})
        return AddUser(user=user)


class UpdateUser(Mutation):
    class Arguments:
        address = String(required=True)
        email = String(required=True)

    user = Field(lambda: UserType)

    async def mutate(self, info, address, email):
        user = await info.context["db"].users.find_one({"address": { "$eq": address }})

        if user:
            user["email"] = email if email != "null" else None
            info.context["db"].users.update_one({"address": address}, {"$set": user})
            return UpdateUser(user=user)

        return UpdateUser(user=None)


class AddNotificationScope(Mutation):
    class Arguments:
        type = String(required=True) # Enum.from_enum(NotificationScopeTypeEnum)(required=True)
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

    notification_scope = Field(lambda: NotificationScopeType)

    async def mutate(self, info, **kwargs):
        notification_scope = kwargs
        notification_scope["user"] = "MUUSER"
        print(notification_scope)

        user = info.context["db"].notification_scopes.insert_one(notification_scope)
        return AddNotificationScope(notification_scope=notification_scope)


class Mutation(ObjectType):
    add_user = AddUser.Field()
    update_user = UpdateUser.Field()

    add_notification_scope = AddNotificationScope.Field()