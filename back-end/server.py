from os import environ as env
from flaskext.mysql import MySQL
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_oauthlib.client import OAuth
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message

import os, json
import constants as constants
from flask_back.views import view_manager
from flask_back.apis.v1 import admin_manager
from flask_back.apis.api import *
from flask_back.models.model import db 

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

ENV_PARAM = {}
ENV_PARAM["AUTH0_CALLBACK_URL"] = env.get(constants.AUTH0_CALLBACK_URL)
ENV_PARAM["AUTH0_CLIENT_ID"] = env.get(constants.AUTH0_CLIENT_ID)
ENV_PARAM["AUTH0_CLIENT_SECRET"] = env.get(constants.AUTH0_CLIENT_SECRET)
ENV_PARAM["AUTH0_DOMAIN"] = env.get(constants.AUTH0_DOMAIN)

APP = Flask(__name__, static_url_path='/build', static_folder='../front-end/build')
CORS(APP)
mail = Mail(APP)
APP.secret_key = "client_secret"
API = Api(APP)
APP.register_blueprint(view_manager.blueprint)
db_user = env.get(constants.MYSQL_DATABASE_USER)
db_pass = env.get(constants.MYSQL_DATABASE_PASSWORD)
db_host = env.get(constants.MYSQL_DATABASE_HOST)
db_name = env.get(constants.MYSQL_DATABASE_DB)
db_sock = env.get(constants.MYSQL_DATABASE_SOCKET)
APP.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://' + db_user + ':' + db_pass + '@' + db_host + '/' + db_name + db_sock
db.init_app(APP)

# If you are new server manager, you need to run this once.
db.create_all(app=APP)

# Format error response and append status code.
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

@APP.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Initializer
oauth = OAuth(APP)
auth0 = oauth.remote_app(
    'auth0',
    consumer_key=ENV_PARAM["AUTH0_CLIENT_ID"],
    consumer_secret=ENV_PARAM["AUTH0_CLIENT_SECRET"],
    request_token_params={
        'scope': 'openid profile',
        'audience': 'https://' + ENV_PARAM["AUTH0_DOMAIN"] + '/userinfo'
    },
    base_url='https://%s' % ENV_PARAM["AUTH0_DOMAIN"],
    access_token_method='POST',
    access_token_url='/oauth/token',
    authorize_url='/authorize',
)
view_manager._initializer(auth0, ENV_PARAM)

# API routing define
API.add_resource(GetUserSelf, '/api/v1/userself')
API.add_resource(SetNewOrder, '/api/v1/neworder')
API.add_resource(GetOrders, '/api/v1/orders')
API.add_resource(GetOrderOwner, '/api/v1/get/order/owner')
API.add_resource(GetProfile, '/api/v1/get/profile')
API.add_resource(SaveProfile, '/api/v1/save/profile')
API.add_resource(GetWallet, '/api/v1/get/wallet')

if __name__ == "__main__":
    SERVER_PORT = env.get(constants.SERVER_PORT)
    APP.run(host='0.0.0.0', port=env.get('PORT', int(SERVER_PORT)), debug=True)
    