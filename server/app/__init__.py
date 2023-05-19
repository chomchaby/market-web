from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///market.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
# app.config['CORS_ALLOW_CREDENTIALS'] = True
app.config['SECRET_KEY'] = '9e1e297112b36eef9df2963b'

app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
# app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
# app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/refresh'
app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_COOKIE_SAMESITE'] = 'None'
# app.config['JWT_COOKIE_DOMAIN'] = 'dev.localhost'
app.config['JWT_SECRET_KEY'] = 'super-secret'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=50)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=5)


db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

CORS(app, resources={
  r"/*": {
      "origins": "*",
      "supports_credentials": True,
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  }
})

from app.routes import home, register, login, refresh, logout, my_store, my_product, cart, transaction