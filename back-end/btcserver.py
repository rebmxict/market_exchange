import requests, json, time
import constants as constants
from os import environ as env
from dotenv import load_dotenv, find_dotenv
from bitcoinlib.wallets import HDWallet, wallet_create_or_open
from bitcoinlib.services.services import *
import pymysql.cursors
from datetime import datetime

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

db_user = env.get(constants.MYSQL_DATABASE_USER)
db_pass = env.get(constants.MYSQL_DATABASE_PASSWORD)
db_host = env.get(constants.MYSQL_DATABASE_HOST)
db_sock = env.get(constants.MYSQL_UNIX_SOCKET)
db_name = env.get(constants.MYSQL_DATABASE_DB)

def func_walletupdate():
	connection = pymysql.connect(host=db_host,
                             user=db_user,
                             password=db_pass,
                             db=db_name,
                             unix_socket=db_sock)

	cursor = connection.cursor(pymysql.cursors.DictCursor)
	# Current ACCOUNT_ID: 4, PURPOSE: 44
	sql = "SELECT * FROM `wallet_infos` WHERE `account_id`=%s AND `wallet_name`=%s AND `network`=%s AND `purpose`=%s AND `status`=%s"
	cursor.execute(sql, (constants.ACCOUNT_ID, constants.WALLET_NAME, constants.BITCOIN_NETWORK, constants.PURPOSE, "pending"))
	walletinfos = cursor.fetchall()

	# Get wallet
	wallet = wallet_create_or_open(name=constants.WALLET_NAME, purpose=constants.PURPOSE, account_id=constants.ACCOUNT_ID, 
				network=constants.BITCOIN_NETWORK)
	wallet._balance_update(account_id=constants.ACCOUNT_ID, network=constants.BITCOIN_NETWORK)
	wallet.utxos_update(account_id=constants.ACCOUNT_ID, update_balance=True)

	sql = "SELECT * FROM `games` ORDER BY id DESC LIMIT 1"
	cursor.execute(sql)
	currentgame = cursor.fetchone()

	if currentgame:
		# Check wallet info
		for walletinfo in walletinfos:
			walletkey = wallet.import_key(account_id=constants.ACCOUNT_ID, key=walletinfo["key"])

			delay = 0
			if len(walletinfo["addrGenDate"]) <= 15:
				epoch_time = int(time.time())
				wallet_date = int(walletinfo["addrGenDate"][1:][:10])
				wallet_date = datetime.fromtimestamp(wallet_date/1000).strftime("%d")
				current_date = datetime.fromtimestamp(epoch_time/1000).strftime("%d")
				delay = int(current_date) - int(wallet_date)
				print("======", delay)

			if walletkey.balance() > 0 and delay > 1 and walletinfo["status"] is "pending":
				sql = "DELETE FROM `pixel_infos` WHERE `id`=%s"
				cursor.execute(sql, walletinfo["pixelinfo_id"])
				connection.commit()
				sql = "DELETE FROM `wallet_infos` WHERE `id`=%s"
				cursor.execute(sql, walletinfo["id"])
				connection.commit()

			# addresslst = []
			# addresslst.append(walletkey.address)
			# srv = Service(network=constants.BITCOIN_NETWORK, providers=['blockexplorer', 'blockchaininfo'])
			# srv.getbalance(addresslst)
			# srv.gettransactions(addresslst)
			# srv.getutxos(addresslst)

			print("=== HDWalletKey ===", walletkey.address, walletkey.balance())
			if walletkey.balance() != 0:
				pixelinfo_id = walletinfo["pixelinfo_id"]
				sql = "SELECT * FROM `pixel_infos` WHERE `id`=%s"
				cursor.execute(sql, pixelinfo_id)
				pixelinfo = cursor.fetchone()
				pixel_price = currentgame["pixel_price"]
				agreedbtc = (pixelinfo["widthv"] * pixelinfo["heightv"] * constants.BITCOIN_CONVERT) * pixel_price\
							 * (1 - constants.BITCOIN_FEE)
				# print("=== Agreed Bitcoin Amount ===", agreedbtc)
				if walletkey.balance() >= agreedbtc:
					sql = "UPDATE `wallet_infos` SET `balance`=%s, `status`='accepted' WHERE `id`=" + str(walletinfo["id"])
					cursor.execute(sql, (walletkey.balance()))
					connection.commit()
				else:
					sql = "UPDATE `wallet_infos` SET `balance`=%s WHERE `id`=" + str(walletinfo["id"])
					cursor.execute(sql, (walletkey.balance()))
					connection.commit()

	connection.close()
	# print("=== Wallet Balance ===", wallet.balance())

def func_invitation():
	connection = pymysql.connect(host=db_host,
                             user=db_user,
                             password=db_pass,
                             db=db_name,
                             unix_socket=db_sock)
	cursor = connection.cursor(pymysql.cursors.DictCursor)

	sql = "SELECT * FROM `invites` WHERE `accpeted_status`=0"
	cursor.execute(sql)
	invite_emails = cursor.fetchall()
	for invite_email in invite_emails:
		sql = """
		SELECT *
		FROM 
		(
			SELECT pixel_infos.id
			FROM pixel_infos,
			(
				SELECT user_infos.id
				FROM user_infos 
				WHERE email=%s
			) AS user_info
			WHERE pixel_infos.user_id=user_info.id
		) AS pixel_info
		WHERE EXISTS
		(
			SELECT 1
			FROM wallet_infos
			WHERE pixelinfo_id=pixel_info.id AND status='accepted'
		)
		"""
		cursor.execute(sql, invite_email["invite_email"])
		pixelinfos = cursor.fetchall()
		if len(pixelinfos) > 0:
			# Update accepted status
			sql = "UPDATE `invites` SET `accpeted_status`=1 WHERE `invite_email`=%s"
			cursor.execute(sql, invite_email["invite_email"])
			connection.commit()
			# Add bonus pixels to inviting user
			my_email = invite_email["my_email"]
			sql = "SELECT * FROM `user_infos` WHERE `email`=%s"
			cursor.execute(sql, my_email)
			user_id = (cursor.fetchone())["id"]
			sql = "SELECT * FROM `pixel_infos` WHERE 1=1"
			cursor.execute(sql)
			pixelinfos = cursor.fetchall()
			outf = True
			for x in range(100):
				for y in range(100):
					for pixelinfo in pixelinfos:
						if pixelinfo["startx"] == x * 10 and pixelinfo["starty"] == y * 10:
							outf = False
					if outf:
						sql = """
							INSERT INTO `pixel_infos` (user_id, widthv, heightv, startx, starty, info)
							VALUES (%s, %s, %s, %s, %s, %s)
							"""
						cursor.execute(sql, (user_id, 10, 10, x * 10, y * 10, "bonus"))
						connection.commit()
						sql = "SELECT * FROM `pixel_infos` WHERE `startx`=%s AND `starty`=%s"
						cursor.execute(sql, (x * 10, y * 10))
						pixelinfo_id = (cursor.fetchone())["id"]
						sql = """
							INSERT INTO `wallet_infos` (pixelinfo_id, account_id, wallet_name, network, purpose, addrGenDate, status)
							VALUES (%s, %s, %s, %s, %s, %s, %s)
							"""
						cursor.execute(sql, (pixelinfo_id, user_id, constants.WALLET_NAME, constants.BITCOIN_NETWORK, constants.PURPOSE, " Bonus", "accepted"))
						connection.commit()
						break
					outf = True
				if outf:
					break

			print("=== email ===", my_email)
	print("=== looping ===")
	connection.close()

while 1 is 1:
	# r = requests.get('http://localhost:5000/api/v1/walletupdate')
	func_walletupdate()
	func_invitation()
	time.sleep(constants.TIME_DELAY)