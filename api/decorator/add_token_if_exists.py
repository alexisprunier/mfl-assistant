from functools import wraps

from bson import ObjectId
from fastapi import HTTPException, status
import jwt
from utils.jwt import verify_token
from fastapi import Request
import inspect


def add_token_if_exists(f):
    @wraps(f)
    async def wrapper(root, info, *args, **kwargs):
        request = info.context["request"]
        token = request.cookies.get('access_token_cookie')

        try:
            decoded = verify_token(token)
        except jwt.ExpiredSignatureError:
            if inspect.iscoroutinefunction(f):
                return await f(root, info, *args, **kwargs)
            else:
                return f(root, info, *args, **kwargs)
        except jwt.InvalidTokenError:
            if inspect.iscoroutinefunction(f):
                return await f(root, info, *args, **kwargs)
            else:
                return f(root, info, *args, **kwargs)

        if not decoded["address"]:
            if inspect.iscoroutinefunction(f):
                return await f(root, info, *args, **kwargs)
            else:
                return f(root, info, *args, **kwargs)

        user = await info.context["db"].users.find_one({"address": decoded["address"]})
            
        if not user:
            info.context["db"].users.insert_one({"address": decoded["address"]})
            user = await info.context["db"].users.find_one({"address": decoded["address"]})

        info.context["user"] = user

        if inspect.iscoroutinefunction(f):
            return await f(root, info, *args, **kwargs)
        else:
            return f(root, info, *args, **kwargs)

    return wrapper
