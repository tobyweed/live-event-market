from flask_restful import Resource, reqparse
from models import UserModel
from flask_jwt_extended import jwt_required

parser = reqparse.RequestParser()

class OneUser(Resource):
    def get(self):
        return UserModel.find_by_username()

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
