from flask_back.models.model import *
from flask_back.models.model import db
from bitcoinlib.wallets import HDWallet, wallet_create_or_open
from bitcoinlib.services.services import *
import constants

def admin_auth(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		try:
			IsAdmin = Users.query.filter_by(auth0_id=session[constants.PROFILE_KEY]["auth0_id"]).first().IsAdmin
		except:
			IsAdmin = 0
			return {"status": "failed"}, 400

		if not IsAdmin:
			return {"status": "unautharized"}, 401
		return f(*args, **kwargs)
	return decorated