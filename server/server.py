import os
from flask import Flask, jsonify
from flask_restful import Api
from models import db, whooshee
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__) #initialize Flask app
app.config.from_object(os.environ['APP_SETTINGS']) #config must be defined in an envvar, ex.: "config.DevelopmentConfig"
api = Api(app) #make an Flask_RESTful api for the app


#configure db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) #necessary to do it this way to avoid circular imports
whooshee.init_app(app)

#configure jwt
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)

#create all db tables
@app.before_first_request
def create_tables():
    from models import UserModel, RevokedTokenModel, PromoterModel
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
import models, endpoints
api.add_resource(endpoints.UserRegistration, '/registration')
api.add_resource(endpoints.UserLogin, '/login')
api.add_resource(endpoints.UserLogoutAccess, '/logout/access')
api.add_resource(endpoints.UserLogoutRefresh, '/logout/refresh')
api.add_resource(endpoints.TokenRefresh, '/token/refresh')
api.add_resource(endpoints.AllUsers, '/users')
api.add_resource(endpoints.OneUser, '/user/<string:user>')
api.add_resource(endpoints.PromoterRegistration, '/promoters/registration')
api.add_resource(endpoints.OnePromoter, '/promoter/<string:user>')
api.add_resource(endpoints.AddUser, '/promoter/adduser')
api.add_resource(endpoints.CreateEvent, '/create-event')
api.add_resource(endpoints.OneEvent, '/event/<int:id>')
api.add_resource(endpoints.SearchEvents, '/events/<string:name>')

#run
if __name__ == '__main__':
    app.run()
