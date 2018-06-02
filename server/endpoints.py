from flask_restful import Resource, request
from models import PromoterModel, UserModel, RevokedTokenModel
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from marshmallow import Schema, fields, post_load

#declare schemas
class UserSchema(Schema):
    username = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    password = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    firstName = fields.Str(missing=None)
    lastName = fields.Str(missing=None)
    email = fields.Str(missing=None)
    phoneNumber = fields.Str(missing=None)
    proPic = fields.Str(missing=None)
    organization = fields.Str(missing=None)
    promoter_name = fields.Str()

class PromoterSchema(Schema):
    name = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)

#initialize schemas
user_schema = UserSchema()
promoter_schema = PromoterSchema()


'''
================USER RESOURCES================
'''
#return one user's data.
#can only be called by that user.
class OneUser(Resource):
    @jwt_required
    def get(self, user):
        current_user = get_jwt_identity()
        result = UserModel.find_by_username(user)

        if(user == current_user):
            return user_schema.dump(result)
        else:
            return {'message': 'You are not authorized to access this information.'}

#this is a development route, to be deleted later
class AllUsers(Resource):
    def get(self):
        return UserModel.return_all()

    def delete(self):
        return UserModel.delete_all()


'''
================PROMOTER RESOURCES================
'''
#return one promoter's data.
#can only be called by a user who is associated with the promoter.
class OnePromoter(Resource):
    @jwt_required
    def get(self, user):
        #get identity & find the identity's info
        current_user = get_jwt_identity()
        result = UserModel.find_by_username(user)
        #pull our associated promoter's name from our info. Note that this will throw an error if the user has no associated promoter
        promoter_name = result.promoter_name
        promoter = PromoterModel.find_by_name(promoter_name)

        #if we're the right user, serialize the found promoter and return the results
        if(user == current_user):
            return promoter_schema.dump(promoter)
        else:
            return {'message': 'You are not authorized to access this information.'}


#register a new promoter
class PromoterRegistration(Resource):
    @jwt_required
    def post(self):
        data = request.get_json()
        promoter = promoter_schema.load(data)
        #get current user
        current_user = get_jwt_identity()
        user = UserModel.find_by_username(current_user)

        #do not process request if a promoter with that name already exists
        if PromoterModel.find_by_name(promoter.data['name']):
            return {'message': 'Promoter {} already exists'. format(promoter.data['name'])}

        #do not process request if this user already has an associated promoter
        if user.promoter_name:
            return {'message': 'You are already associated with a promoter account'}

        new_promoter = PromoterModel(
            name = promoter.data['name']
        )


        new_promoter.users.append(user)

        try:
            new_promoter.save_to_db()
            return {
                'message': 'Promoter {} was created'.format( promoter.data['name'])
            }
        except:
            return {'message': 'Something went wrong'}, 500



'''
================MISC RESOURCES================
'''
#secret resource for testing
class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {
            'answer': 42
        }



'''
================AUTH RESOURCES================
'''

#register new user
class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        user = user_schema.load(data)
        if UserModel.find_by_username(data['username']):
            return {'message': 'User {} already exists'. format(data['username'])}

        new_user = UserModel(
            username = user.data['username'],
            password = UserModel.generate_hash(user.data['password']),
            firstName = user.data['firstName'],
            lastName = user.data['lastName'],
            email = user.data['email'],
            phoneNumber = user.data['phoneNumber'],
            proPic = user.data['proPic'],
            organization = user.data['organization']
        )

        try:
            new_user.save_to_db()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created'.format( data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            return {'message': 'Something went wrong'}, 500

#log in with a username and password
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = user_schema.load(data)
        current_user = UserModel.find_by_username(data['username'])
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}

        if UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
                }
        else:
            return {'message': 'Wrong credentials'}


#THE BELOW ROUTES ARE NOT TESTED OR IMPLEMENTED ON THE CLIENT YET
class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti = jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        refresh_token = create_refresh_token(identity = current_user)
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
