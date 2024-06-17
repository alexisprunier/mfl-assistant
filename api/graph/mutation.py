from graphene import Mutation, ObjectType, String, Int, Field, ID, Boolean, List

from decorator.require_token import require_token
from graph.schema import UserType, NotificationScopeType, NotificationType, TeamType, TeamMemberType
import datetime
import secrets
from bson import ObjectId
from mail.mail_manager import send_confirmation_mail
import copy


class UpdateLoggedUserEmail(Mutation):
    class Arguments:
        email = String(required=True)

    user = Field(lambda: UserType)

    @require_token
    async def mutate(self, info, email):
        user = copy.deepcopy(info.context["user"])

        user["email"] = email.lower() if email != "null" else None
        user["confirmation_code"] = secrets.token_hex(32) if user["email"] is not None else None
        user["is_email_confirmed"] = False

        info.context["db"].users.update_one({"address": user["address"]}, {"$set": user})

        if user["email"] is not None:
            await send_confirmation_mail(info.context["mail"], user["email"], user["confirmation_code"])

        return UpdateLoggedUserEmail(user=user)



class SendConfirmationEmail(Mutation):
    class Arguments:
        address = String(required=True)
        email = String(required=True)

    user = Field(lambda: UserType)

    @require_token
    async def mutate(self, info, address, email):
        user = await info.context["db"].users.find_one({"address": {"$eq": address}})

        if user and user["email"] is not None:
            user["confirmation_code"] = secrets.token_hex(32) if email != "null" else None

            info.context["db"].users.update_one({"address": address}, {"$set": user})
            await send_confirmation_mail(info.context["mail"], user["email"], user["confirmation_code"])

            return SendConfirmationEmail(user=user)

        return SendConfirmationEmail(user=None)


class AddNotificationScope(Mutation):
    class Arguments:
        user = String(required=True)
        type = String(required=True)  # Enum.from_enum(NotificationScopeTypeEnum)(required=True)
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

    @require_token
    async def mutate(self, info, **kwargs):
        user = await info.context["db"].users.find_one({"address": kwargs["user"]})

        if user:
            notification_scope = kwargs
            notification_scope["status"] = "active"
            notification_scope["user"] = user["_id"]
            notification_scope["creation_date"] = datetime.datetime.now()

            notification_scope = info.context["db"].notification_scopes.insert_one(notification_scope)
            return AddNotificationScope(notification_scope=notification_scope)
        else:
            raise Exception("User not found")


class DeleteNotificationScope(Mutation):
    class Arguments:
        scope_id = String(required=True)

    notification_scope = Field(lambda: NotificationScopeType)

    @require_token
    async def mutate(self, info, scope_id):
        # user = await info.context["db"].users.find_one({"address": {"$eq": user_id}})

        # if user:
        notification_scope = info.context["db"].notification_scopes.find_one({
            "_id": ObjectId(scope_id)
        })

        if notification_scope:
            info.context["db"].notification_scopes.delete_one({'_id': ObjectId(scope_id)})
            return DeleteNotificationScope(notification_scope=notification_scope)
        else:
            raise Exception("Scope not found")
        # else:
        #    raise Exception("User not found")


class AddNotification(Mutation):
    class Arguments:
        notification_scope_id = ID(required=True)

    notification = Field(lambda: NotificationType)

    @require_token
    async def mutate(self, info, notification_scope_id, **kwargs):
        scope = await info.context["db"].notification_scopes.find_one({"_id": ObjectId(notification_scope_id)})

        if scope:
            notification = kwargs
            notification["notification_scope"] = scope["_id"]

            notification = await info.context["db"].notifications.insert_one(notification)
            return AddNotification(notification=notification)
        else:
            raise Exception("Notification scope not found")


class AddTeam(Mutation):
    class Arguments:
        name = String(required=True)
        formation = String()
        is_public = Boolean()

    team = Field(lambda: TeamType)

    @require_token
    async def mutate(self, info, **kwargs):
        team = kwargs
        team["user"] = info.context["user"]["_id"]
        team = await info.context["db"].teams.insert_one(team)
        return AddTeam(team=team)


class UpdateTeam(Mutation):
    class Arguments:
        id = ID(required=True)
        name = String()
        formation = String()
        is_public = Boolean()

    status = Boolean()

    @require_token
    async def mutate(self, info, id, **kwargs):
        await info.context["db"].teams.update_one({"_id": ObjectId(id)}, {'$set': kwargs})
        return UpdateTeam(status=True)


class AddTeamMembers(Mutation):
    class Arguments:
        team_id = ID(required=True)
        player_ids = List(Int, required=True)

    team_members = List(TeamMemberType)

    @require_token
    async def mutate(self, info, **kwargs):
        team_members = [{"team": ObjectId(kwargs["team_id"]), "player": p} for p in kwargs["player_ids"]]
        team_members = await info.context["db"].team_members.insert_many(team_members)
        team_members = await info.context["db"].team_members \
            .find({"_id": { "$in": team_members.inserted_ids }}) \
            .to_list(length=None)
        return AddTeamMembers(team_members=team_members)


class UpdateTeamMember(Mutation):
    class Arguments:
        id = ID(required=True)
        position = Int()

    status = Boolean()

    @require_token
    async def mutate(self, info, id, **kwargs):
        await info.context["db"].team_members.update_many({"position": kwargs["position"]}, {'$set': {"position": None}})
        await info.context["db"].team_members.update_one({"_id": ObjectId(id)}, {'$set': kwargs})
        return UpdateTeamMember(status=True)


class DeleteTeamMember(Mutation):
    class Arguments:
        team_member_id = String(required=True)

    status = Boolean()

    @require_token
    async def mutate(self, info, team_member_id):
        team_member = info.context["db"].team_members.find_one({
            "_id": ObjectId(team_member_id)
        })

        if team_member:
            info.context["db"].team_members.delete_one({'_id': ObjectId(team_member_id)})
            return DeleteTeamMember(status=True)
        else:
            raise Exception("Team member not found")


class Mutation(ObjectType):
    update_logged_user_email = UpdateLoggedUserEmail.Field()
    add_notification_scope = AddNotificationScope.Field()
    delete_notification_scope = DeleteNotificationScope.Field()
    add_notification = AddNotification.Field()
    send_confirmation_mail = SendConfirmationEmail.Field()
    add_team = AddTeam.Field()
    update_team = UpdateTeam.Field()
    add_team_members = AddTeamMembers.Field()
    update_team_member = UpdateTeamMember.Field()
    delete_team_member = DeleteTeamMember.Field()
