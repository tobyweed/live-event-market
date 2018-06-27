import os
import datetime
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__) #initialize Flask app
CORS(app)
app.config.from_object(os.environ['APP_SETTINGS']) #config must be defined in an envvar, ex.: "config.DevelopmentConfig"
api = Api(app) #make an Flask_RESTful api for the app

#configure jwt
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
# currently have access token expiration disabled until I can figure out the token refresh bug (Tokens refresh, but only after refreshing the page)
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(0,10800)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
jwt = JWTManager(app)

#create all db tables
@app.before_first_request
def create_tables():
    from database import init_db
    init_db()

from database import db_session
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

#support jwt blacklisting for logouts
@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    from models import RevokedTokenModel
    return RevokedTokenModel.is_jti_blacklisted(jti)

#root.. not sure I need this
@app.route('/')
def index():
    print("WOohoooo!!!")
    return jsonify({'message': 'Hello, World!'})

# configure Flask_RESTful api
import endpoints
api.add_resource(endpoints.UserRegistration, '/registration')
api.add_resource(endpoints.UserLogin, '/login')
api.add_resource(endpoints.UserLogoutAccess, '/logout/access')
api.add_resource(endpoints.UserLogoutRefresh, '/logout/refresh')
api.add_resource(endpoints.TokenRefresh, '/token/refresh')
api.add_resource(endpoints.OneUser, '/user/<string:user>')
api.add_resource(endpoints.PromoterRegistration, '/promoters/registration')
api.add_resource(endpoints.OnePromoter, '/promoter/<string:user>')
api.add_resource(endpoints.AddUserToPromoter, '/promoter/adduser')
api.add_resource(endpoints.CreateEvent, '/create-event')
api.add_resource(endpoints.OneEvent, '/event/<int:id>')
api.add_resource(endpoints.SearchEvents, '/search-events')

#run
if __name__ == '__main__':
    app.run(host='0.0.0.0', port = int(os.environ.get('PORT', 5000)))
