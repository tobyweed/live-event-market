import os
from flask import Flask, jsonify
from flask_restful import Api
from models import db #Necessary to do it this way to avoid circular imports

from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__) #initialize Flask app
app.config.from_object(os.environ['APP_SETTINGS']) #config must be defined in an envvar, ex.: "config.DevelopmentConfig"
api = Api(app) #make an Flask_RESTful api for the app

#configure db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app) #necessary to do it this way to avoid circular imports

#configure jwt
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)

#create all db tables
@app.before_first_request
def create_tables():
    from models import UserModel, RevokedTokenModel
    db.create_all()

#support jwt blacklisting for logouts
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blacklisted(jti)

#root
@app.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})

#configure Flask_RESTful api
import models, auth, resources
api.add_resource(auth.UserRegistration, '/registration')
api.add_resource(auth.UserLogin, '/login')
api.add_resource(auth.UserLogoutAccess, '/logout/access')
api.add_resource(auth.UserLogoutRefresh, '/logout/refresh')
api.add_resource(auth.TokenRefresh, '/token/refresh')
api.add_resource(resources.AllUsers, '/users')
api.add_resource(resources.SecretResource, '/yo')

#run
if __name__ == '__main__':
    app.run()
