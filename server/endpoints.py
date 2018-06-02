from flask_restful import Resource, request
from models import UserModel, RevokedTokenModel
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from marshmallow import Schema, fields, post_load

class UserSchema(Schema):
    username = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    password = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    firstName = fields.Str(missing=None)
    lastName = fields.Str(missing=None)
    email = fields.Str(missing=None)
    phoneNumber = fields.Str(missing=None)
    proPic = fields.Str(missing=None)
    organization = fields.Str(missing=None)


user_schema = UserSchema()

class OneUser(Resource):
    def get(self, user):
        result = UserModel.find_by_username(user)
        return user_schema.dump(result)

class AllUsers(Resource):
    def get(self):
        return UserModel.return_all()

    def delete(self):
        return UserModel.delete_all()

class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {
            'answer': 42
        }



class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        user = user_schema.load(data)
        if UserModel.find_by_username(data['username']):
            return {'message': 'User {} already exists'. format(data['username'])}

        print(user)
        new_user = UserModel(
            username = user.data['username'],
            password = UserModel.generate_hash(user.data['password']),
            firstName = user.data['firstName'],
            lastName = user.data['lastName'],
            email = user.data['email'],
            phoneNumber = user.data['phoneNumber'],
            proPic = user.data['proPic'],
            organization = user.data['organization'],
        )
        # new_user = UserModel(user.data)
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
        return {'access_token': access_token}
