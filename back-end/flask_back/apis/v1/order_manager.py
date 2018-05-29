from flask_back.models.model import *
from flask_back.models.model import db
from flask_back.apis.v1 import wallet_manager
import time, constants

def getorders():
	re_orders = []
	orders = Orders.query.all()
	for order in orders:
		re_orders.append(order.as_dict())
	return re_orders

def setneworder(profile, body):
	try:
		user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
		re_val = acceptorder(user.id, body["symbol"], body["coinamount"], body["usdamount"])
		if re_val["status"] is not "success":
			return re_val
		current_time = int(time.time())
		neworder = Orders(user_id=user.id, symbol=body["symbol"], coinamount=body["coinamount"], usdamount=body["usdamount"],
			status="filled", created_at=current_time, updated_at=0)
		db.session.add(neworder)
		db.session.commit()
		return re_val
	except:
		return {"status": "Something wrong in adding new order."}

def deleteorder(body):
	for delorderinfo in body:	
		order = Orders.query.filter_by(user_id=delorderinfo["user_id"], id=delorderinfo["id"]).first()
		db.session.delete(order)
		db.session.commit()
	return {"status": "success"}, 200

def getorderowner(body):
	re_val = {}
	# Get selected order
	order = Orders.query.filter_by(user_id=body["user_id"], id=body["id"]).first()
	re_val = order.as_dict()
	# Get selected order's owner userinfo
	user = Users.query.filter_by(id=body["user_id"]).first()
	re_val.update(user.as_dict())
	# Get selected order's owner wallet
	wallet = Wallets.query.filter_by(user_id=body["user_id"]).first()
	re_val["btcbalance"] = wallet_manager.getotherbalance(wallet.id)
	# Get selected order's owner profile
	profile = Profiles.query.filter_by(user_id=body["user_id"]).first()
	if profile.avatar:
		profile.avatar = profile.avatar.decode("utf-8")
	db.session.no_autoflush
	re_val.update(profile.as_dict())
	del re_val["auth0_id"]
	del re_val["id"]
	re_val["order_id"] = order.id
	re_val["user_id"] = user.id
	return re_val, 200

def acceptorder(user_id, symbol, coinamount, usdamount):
	if symbol[:3] == "USD":
		bank = Banks.query.filter_by(user_id=user_id).first()
		if bank.balance >= float(usdamount):
			bank.balance = bank.balance - float(usdamount)
			db.session.commit()
		else:
			return {"status": "USD balance is not available."}
		wallet = Wallets.query.filter_by(user_id=user_id, symbol=symbol[3:].lower()).first()
		wallet.balance = wallet.balance + float(coinamount)
		db.session.commit()
	else:
		wallet = Wallets.query.filter_by(user_id=user_id, symbol=symbol[:3].lower()).first()
		if wallet.balance >= float(coinamount):
			wallet.balance = wallet.balance - float(coinamount)
			db.session.commit()
		else:
			return {"status": symbol[:3] + " balance is not available."}
		bank = Banks.query.filter_by(user_id=user_id).first()
		bank.balance = bank.balance + float(usdamount)
		db.session.commit()
	return {"status": "success"}