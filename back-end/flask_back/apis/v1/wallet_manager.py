from flask_back.models.model import *
from flask_back.models.model import db
from bitcoinlib.wallets import HDWallet, wallet_create_or_open
from bitcoinlib.services.services import *
import constants

def getnewaddress():
	wallet_obj = wallet_create_or_open(name=constants.WALLET_NAME, purpose=constants.PURPOSE, account_id=constants.ACCOUNT_ID, 
				network=constants.BITCOIN_NETWORK)
	key = wallet_obj.new_key()
	re_val = {
		"account_id": constants.ACCOUNT_ID,
		"wallet_name": constants.WALLET_NAME,
		"purpose": constants.PURPOSE,
		"network": constants.BITCOIN_NETWORK,
		"key": key.wif,
		"balance": key.balance(),
		"address": key.address
	}
	return re_val

def getaddress(profile):
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	wallet = Wallets.query.filter_by(user_id=user.id).first()
	return {"address": wallet.depositaddress}, 200


def getbalance(profile):
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	wallet = Wallets.query.filter_by(user_id=user.id).first()
	wallet_obj = wallet_create_or_open(name=constants.WALLET_NAME, purpose=constants.PURPOSE, account_id=constants.ACCOUNT_ID, 
				network=constants.BITCOIN_NETWORK)
	walletkey = wallet_obj.import_key(account_id=constants.ACCOUNT_ID, key=wallet.key)
	return walletkey.balance()

def getotherbalance(wallet_id):
	wallet = Wallets.query.filter_by(id=wallet_id).first()
	wallet_obj = wallet_create_or_open(name=constants.WALLET_NAME, purpose=constants.PURPOSE, account_id=constants.ACCOUNT_ID, 
				network=constants.BITCOIN_NETWORK)
	walletkey = wallet_obj.import_key(account_id=constants.ACCOUNT_ID, key=wallet.key)
	return walletkey.balance()

def getwallet(profile):
	re_val = {
		"bank": 0,
		"btc": 0,
		"eth": 0,
		"xrp": 0,
		"bch": 0,
		"available_coins": []
	}
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	bank = Banks.query.filter_by(user_id=user.id).first()
	re_val["bank"] = bank.balance
	wallets = Wallets.query.filter_by(user_id=user.id).all()
	for wallet in wallets:
		re_val[wallet.symbol] = wallet.balance
		re_val["available_coins"].append(wallet.symbol)
	return re_val

def savewallet(profile, body):
	user = Users.query.filter_by(auth0_id=profile["auth0_id"]).first()
	wallet = Wallets.query.filter_by(user_id=user.id).first()
	wallet.withdrawaddress = body["withdrawaddress"]
	db.session.commit()
	bank = Banks.query.filter_by(user_id=user.id).first()
	bank.name = body["name"]
	db.session.commit()
	return {"status": "success"}, 200