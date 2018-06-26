from flask_restful import Resource, request
from sqlalchemy import update
from datetime import datetime
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
import json

from models import (PromoterModel, UserModel, RevokedTokenModel, Event, EventInfo, UserSchema, UserSchemaWithoutPass, PromoterSchema, EventSchema, EventInfoSchema)
from database import db_session
#initialize schemas
user_schema = UserSchema()
user_schema_without_pass = UserSchemaWithoutPass()
promoter_schema = PromoterSchema()
event_info_schema = EventInfoSchema()
event_schema = EventSchema()

'''
================EVENT RESOURCES================
'''

# GET request which accepts a whole bunch of parameters and enters them into the search
class SearchEvents(Resource):
    def get(self):
        args = request.args
        name = args['name']
        start_date = args['start_date']
        end_date = args['end_date']
        # if not name: #name is required
        #     return {'message':'Please enter a search term.'}

        #get list of event_info ids of event_infos matching the search query
        event_ids = EventInfo.search(name, start_date, end_date)
        if not event_ids:
            return {'message':'There are no events matching that description. Please try something else.'}

        try:
            return event_ids
        except:
            return {'message':'Something went wrong.'},500


#return all events with a particular promoter_name (COMMENTED OUT BC MAY NOT BE NECESSARY)
# class GetEventIdsByPromoter(Resource):
#     def get(self, promoter_name):
#         if not promoter_name: #make sure there is a search term
#             return {'message':'Please enter a promoter name to get the events associated with it.'}
#         promoter = PromoterModel.find_by_name(promoter_name)
#         if not promoter: #check if the queried promoter exists
#             return {'message':'That promoter does not exist.'}
#         events = EventInfo.find_ids_by_promoter(promoter_name)
#         if not events: #check if the promoter has any associated events
#             return {'message':'That promoter has not created any events.'}
#         try:
#             return events #return a list of ids
#         except:
#             return {'message':'Something went wrong.'},500



#return all the data of one event_info and all of its events. Query based on id #.
class OneEvent(Resource):
    @jwt_required
    def get(self, id):
        #get the right event_info
        event_info = EventInfo.find_by_id(id)
        if not event_info:
            return {'message': 'An event with that id does not exist.'}, 500
        #serialize event_info
        event_info_dump = event_info_schema.dump(event_info)

        #return the results
        try:
            return event_info_dump
        except:
            return {'message': 'Something went wrong.'}, 500

#create a new event
class CreateEvent(Resource):
    @jwt_required
    def post(self):
        # get json
        data = request.get_json()
        #get current user
        current_user_jwt = get_jwt_identity()
        current_user = UserModel.find_by_username(current_user_jwt)
        current_user_promoter = current_user.promoter_name

        # Throw an error if: current user has no promoter account
        if not current_user_promoter:
            return {'message': 'You cannot create events without a promoter account'}

        # create event_info out of json
        event_info = event_info_schema.load(data)
        new_event_info = EventInfo(
            name = event_info.data['name']
        )

        # create associated event(s) out of nested object(s), single if single plural else
        events = event_info.data['events']
        for i in range(len(events)):
            start_date = events[i]['start_date']
            end_date = events[i]['end_date']
            new_event = Event(
                start_date = start_date,
                end_date = end_date
            )
            # append created Events to created event_info
            new_event_info.events.append(new_event)

        # append create event_info to promoter of current user
        promoter = PromoterModel.find_by_name(current_user_promoter)
        promoter.event_infos.append(new_event_info)

        # try:
        new_event.save_to_db()
        new_event_info.save_to_db()
        promoter.save_to_db()
        #return json serialized promoter's list of event_ids, which now includes the new event
        ret = promoter_schema.dump(promoter)
        print(ret.data['event_infos'])
        return ret.data['event_infos']
            # return {
            #     'message': 'Event {} was created'.format(data['name'])
            # }
        # except:
        #     return {'message': 'Something went wrong'}, 500



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
            return user_schema_without_pass.dump(result)
        else:
            return {'message': 'You are not authorized to access this information.'}
    @jwt_required
    def put(self, user):
        #get the name of the user that we're trying to update
        username = user
        #get the name of the user trying to do the updating
        current_user_name = get_jwt_identity()
        #return a helpful message if the user is trying to edit an account which is not their own
        if not current_user_name == username:
            return {'message': 'You are not authorized to perform that action'}

        #get JSON from request body
        data = request.get_json()

        #load a user object from the data in the request body
        edited_user = user_schema_without_pass.load(data)

        #replace found user's fields with those from the edited_user
        new_user = update(UserModel.__table__).where(UserModel.__table__.c.username==username).values(
            firstName = edited_user.data['firstName'],
            lastName = edited_user.data['lastName'],
            email = edited_user.data['email'],
            phoneNumber = edited_user.data['phoneNumber'],
            proPicUrl = edited_user.data['proPicUrl'],
            organization = edited_user.data['organization']
        )

        try:
            ret = user_schema_without_pass.dump(data)
            db_session.execute(new_user)
            db_session.commit()
            return ret
        except:
            return {'message': 'Something went wrong'}, 500




#this is a development route. Only leaving it here right now as an example of deletion
# class AllUsers(Resource):
#     def delete(self):
#         return UserModel.delete_all()


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
        try:
            promoter_name = result.promoter_name
            promoter = PromoterModel.find_by_name(promoter_name)
        except:
            return {'message': 'You are not associated with a promoter.'}
        #if we're the right user, serialize the found promoter and return the results
        if(user == current_user):
            try:
                return promoter_schema.dump(promoter)
            except:
                return {'message': 'Something went wrong.'}, 500
        else:
            return {'message': 'You are not authorized to access this information.'}

#add a user to a Promoter
class AddUserToPromoter(Resource):
    @jwt_required
    def post(self):
        data = request.get_json()

        #get invited user
        invited_user_name = data['username']
        invited_user = UserModel.find_by_username(invited_user_name)

        if not invited_user:
            return {'message': 'That user does not exist.'}
        #get current user
        current_user_name = get_jwt_identity()
        current_user = UserModel.find_by_username(current_user_name)

        #current user needs to have a promoter account, invited user needs to not have one

        #get promoter
        promoter_name = current_user.promoter_name
        promoter = PromoterModel.find_by_name(promoter_name)
        if not promoter:
            return {'message': 'You cannot add other users to your promoter account if you don\'t have one.'}

        if PromoterModel.find_by_name(invited_user.promoter_name):
            return {'message': 'That user is already part of a promoter account.'}


        #add the user
        promoter.users.append(invited_user)
        try:
            promoter.save_to_db()
            return {
                'message': 'User {} was added to your promoter account.'.format(invited_user_name)
            }
        except:
            return {'message': 'Something went wrong.'}, 500


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
            ret = promoter_schema.dump(new_promoter)
            return ret.data
        except:
            return {'message': 'Something went wrong'}, 500


'''
================AUTH RESOURCES================
'''

#register new user
class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        user = user_schema.load(data)
        if UserModel.find_by_username(data['username']):
            return {'message': 'User {} already exists.'. format(data['username'])}

        new_user = UserModel(
            username = user.data['username'],
            password = UserModel.generate_hash(user.data['password']),
            firstName = user.data['firstName'],
            lastName = user.data['lastName'],
            email = user.data['email'],
            phoneNumber = user.data['phoneNumber'],
            proPicUrl = user.data['proPicUrl'],
            organization = user.data['organization']
        )

        try:
            new_user.save_to_db()
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'User {} was created.'.format( data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        except:
            return {'message': 'Something went wrong.'}, 500

#log in with a username and password
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = user_schema.load(data)
        current_user = UserModel.find_by_username(data['username'])
        if not current_user:
            return {'message': 'User {} doesn\'t exist.'.format(data['username'])}

        if UserModel.verify_hash(data['password'], current_user.password):
            try:
                access_token = create_access_token(identity = data['username'])
                refresh_token = create_refresh_token(identity = data['username'])
                return {
                    'message': 'Logged in as {}'.format(current_user.username),
                    'access_token': access_token,
                    'refresh_token': refresh_token
                    }
            except:
                return { 'message': 'Something went wrong.' }, 500
        else:
            return {'message': 'Wrong password.'}


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
