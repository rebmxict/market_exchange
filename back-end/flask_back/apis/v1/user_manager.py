import requests, time
from flask_back.models.model import *
from flask_back.models.model import db
from email.mime.text import MIMEText
from flask_back.apis.v1 import wallet_manager

def registereduser(profile):
	users = Users.query.filter_by(auth0_id=profile["auth0_id"]).all()
	if len(users) == 0:
		# Add new user
		newuser = Users(auth0_id=profile["auth0_id"], email=profile["email"], IsAdmin=0)
		db.session.add(newuser)
		db.session.commit()

		# Add new user's wallet
		user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
		available_coins = ["btc", "eth", "xrp", "bch"]
		for available_coin in available_coins:
			# newaddr = wallet_manager.getnewaddress()
			newwallet = Wallets(user_id=user.id, symbol=available_coin, balance=0)
			db.session.add(newwallet)
			db.session.commit()
		
		# Add new user's bank
		newbank = Banks(user_id=user.id, balance=10000)
		db.session.add(newbank)
		db.session.commit()

		# Add new user's profile
		current_time = int(time.time())
		newprofile = Profiles(user_id=user.id, created_at=current_time)
		db.session.add(newprofile)
		db.session.commit()
		return True, 0, user.id
	else:
		return True, users[0].IsAdmin, users[0].id

def getprofile(profile):
	re_val = {}
	re_val["email"] = profile["email"]
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	# Get uses's crypto wallet
	wallet = Wallets.query.filter_by(user_id=user.id).first()
	re_val.update({"withdrawaddress": wallet.withdrawaddress})
	# Get user's bank
	bank = Banks.query.filter_by(user_id=user.id).first()
	bank = bank.as_dict()
	del bank["id"]
	re_val.update(bank)
	# Get user's profile
	profile = Profiles.query.filter_by(user_id=user.id).first()
	if profile.avatar:
		profile.avatar = profile.avatar.decode("utf-8")
	re_val.update(profile.as_dict())
	del re_val["user_id"]
	del re_val["id"]
	return re_val, 200

def saveprofile(profile, body):
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	profile = Profiles.query.filter_by(user_id=user.id).first()
	profile.avatar = str.encode(body["avatar"])
	profile.first_name=body["first_name"]
	profile.last_name=body["last_name"]
	profile.summary=body["summary"]
	db.session.commit()
	return {"status": "success"}, 200