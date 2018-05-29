from flask_restful import Resource
from flask import session, request, make_response
from functools import wraps
from flask_back.apis.v1 import user_manager
from flask_back.apis.v1 import admin_manager
from flask_back.apis.v1 import order_manager
from flask_back.apis.v1 import wallet_manager
import constants as constants
import json, os, time

def api_requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if constants.PROFILE_KEY not in session:
            return {"email": "", "IsAdmin": 0, "user_id": 0}
        return f(*args, **kwargs)
    return decorated

# APIs for User
class GetUserSelf(Resource):
    @api_requires_auth
    def get(self):
        profile = session[constants.PROFILE_KEY]
        isRegedUser, IsAdmin, user_id = user_manager.registereduser(profile)
        profile["user_id"] = user_id
        if isRegedUser:
            if IsAdmin:
                profile["IsAdmin"] = 1
            else:
                profile["IsAdmin"] = 0
            re_val = profile
        else:
            re_val = {"email": "", "IsAdmin": 0, "user_id": 0}
        return re_val

class GetProfile(Resource):
    @api_requires_auth
    def get(self):
        profile = session[constants.PROFILE_KEY]
        re_val = user_manager.getprofile(profile)
        return re_val

class SaveProfile(Resource):
    @api_requires_auth
    def post(self):
        profile = session[constants.PROFILE_KEY]
        body = request.get_json(force=True)
        re_val = user_manager.saveprofile(profile, body)
        return re_val

class GetWallet(Resource):
    @api_requires_auth
    def get(self):
        profile = session[constants.PROFILE_KEY]
        re_val = wallet_manager.getwallet(profile)
        return re_val

# APIs for Order
class GetOrders(Resource):
    @api_requires_auth
    def get(self):
        profile = session[constants.PROFILE_KEY]
        re_val = order_manager.getorders()
        return re_val        

class SetNewOrder(Resource):
    @api_requires_auth
    def post(self):
        profile = session[constants.PROFILE_KEY]
        body = request.get_json(force=True)
        re_val = order_manager.setneworder(profile, body)
        return re_val

class GetOrderOwner(Resource):
    @api_requires_auth
    def post(self):
        body = request.get_json(force=True)
        re_val = order_manager.getorderowner(body)
        return re_val