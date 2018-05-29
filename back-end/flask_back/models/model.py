from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	auth0_id = db.Column(db.String(100), nullable=False)
	email = db.Column(db.String(100), nullable=False)
	IsAdmin = db.Column(db.Boolean)

	def __repr__(self):
		return '''
			<Users (id="%d", auth0_id="%s", email="%s", IsAdmin="%r")>
			''' % (self.id, self.user_id, self.email, self.IsAdmin)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Orders(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, default=0)
	symbol = db.Column(db.String(20), default="")
	coinamount = db.Column(db.Float, default=0)
	usdamount = db.Column(db.Float, default=0)
	fee = db.Column(db.Float, default=0)
	status = db.Column(db.String(20), default="")
	created_at = db.Column(db.Integer, default=0)
	updated_at = db.Column(db.Integer, default=0)

	def __repr__(self):
		order = '''
			<Orders (id="%d", user_id="%d", symbol="%s", coinamount="%f", usdamount="%f", fee="%f", status="%d",
				created_at="%d", updated_at="%d")>
			'''
		return order % (self.id, self.user_id, self.symbol, self.coinamount, self.usdamount, self.fee, self.status,
			self.created_at, self.updated_at)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Wallets(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, default=0)
	symbol = db.Column(db.String(20), default="")
	wallet_name = db.Column(db.String(100), default="")
	network = db.Column(db.String(20), default="")
	purpose = db.Column(db.Integer, default=44)
	key = db.Column(db.String(200), default="")
	depositaddress = db.Column(db.String(300), default="")
	withdrawaddress = db.Column(db.String(300), default="")
	balance = db.Column(db.Float, default=0)

	def __repr__(self):
		wallet = '''
			<Wallets (id="%d", user_id="%d", symbol="%s", wallet_name="%s", network="%s", purpose="%d", 
				key="%s", depositaddress="%s", withdrawaddress="%s", balance="%f")>
			'''
		return wallet % (self.id, self.user_id, self.symbol, self.wallet_name, self.network, self.purpose, 
			self.key, self.depositaddress, self.withdrawaddress, self.balance)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Banks(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, default=0)
	name = db.Column(db.String(300), default="")
	address = db.Column(db.String(300), default="")
	swiftcode = db.Column(db.String(20), default="")
	balance = db.Column(db.Float, default=0)

	def __repr__(self):
		bank = '''
			<Banks (id="%d", user_id="%d", name="%s", address="%s", swiftcode="%s", balance="%f")>
			'''
		return bank % (self.id, self.user_id, self.name, self.address, self.swiftcode, self.balance)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Profiles(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, default=0)
	first_name = db.Column(db.String(100), default="")
	last_name = db.Column(db.String(100), default="")
	phone_number = db.Column(db.String(100), default="")
	summary = db.Column(db.String(5000), default="")
	avatar = db.Column(db.BLOB)
	kyc_status = db.Column(db.Integer, default=0)
	created_at = db.Column(db.Integer, default=0)
	updated_at = db.Column(db.Integer, default=0)

	def __repr__(self):
		profile = '''
			<Profiles (id="%d", user_id="%d", first_name="%s", last_name="%s", phone_number="%s", summary="%s",
				avatar="%s", kyc_status="%d", created_at="%d", updated_at="%d")>
			'''
		return profile % (self.id, self.user_id, self.first_name, self.last_name, self.phone_number, self.summary,
			self.avatar, self.kyc_status, self.created_at, self.updated_at)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}