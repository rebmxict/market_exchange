from functools import wraps
from flask import Blueprint, Flask, jsonify, redirect, render_template, request, session, url_for, send_from_directory
import requests, os
from six.moves.urllib.parse import urlencode
import constants as constants


# blueprint initializer
blueprint = Blueprint('view_manager', __name__)

# Global values
auth0 = None
ENV_PARAM = None


# Initializer
def _initializer(rauth0, rENV_PARAM):
	global auth0
	global ENV_PARAM
	auth0 = rauth0
	ENV_PARAM = rENV_PARAM

# authed checking
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if constants.PROFILE_KEY not in session:
            return redirect('/')
        return f(*args, **kwargs)
    return decorated

def autharized(path):
    allowed_exts = [".html", ".css", ".js", ".png", ".jpg"]
    for allowed_ext in allowed_exts:
        if allowed_ext in path:
            return True
    if constants.PROFILE_KEY in session:
        return False
    else:
        return True

@blueprint.route('/home')
def home():
    return redirect('/')

@blueprint.route('/callback')
def callback_handling():
    resp = auth0.authorized_response()
    if resp is None:
        raise AuthError({'code': request.args['error'],
                         'description': request.args['error_description']}, 401)

    # Obtain JWT and the keys to validate the signature
    id_token = resp['id_token']
    access_token = resp['access_token']
    token_type = resp['token_type']

    req_url = "https://"+ENV_PARAM["AUTH0_DOMAIN"]+"/userinfo"
    headers = {'Authorization': token_type+' '+access_token}
    userinfo = requests.get(req_url, headers=headers)
    payload = userinfo.json()

    session[constants.JWT_PAYLOAD] = payload
    session[constants.PROFILE_KEY] = {
        'auth0_id': payload['sub'],
        'email': payload['name'],
        'picture': payload['picture']
    }

    return redirect('/')

@blueprint.route('/login')
def login():
    auth0_res = auth0.authorize(callback=ENV_PARAM["AUTH0_CALLBACK_URL"])
    return auth0_res

@blueprint.route('/logout')
def logout():
    session.clear()
    params = {'client_id': ENV_PARAM["AUTH0_CLIENT_ID"], 'returnTo': url_for('view_manager.home', _external=True)}
    logout_url = auth0.base_url + '/v2/logout?' + urlencode(params)
    return redirect(logout_url)


@blueprint.route('/')
def root():
    return send_from_directory(constants.WEB_START_URL + 'build', 'index.html')

@blueprint.route('/<path:path>')
def serve(path):
    if autharized(path):
        if(os.path.exists(constants.WEB_START_URL + "build/" + path)):
            return send_from_directory(constants.WEB_START_URL + 'build', path)
        else:
            return send_from_directory(constants.WEB_START_URL + 'build', 'index.html')
    else:
        return redirect("/")
