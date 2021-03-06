from flask_restful import Resource, request
from sqlalchemy import update, delete
from datetime import datetime
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
import json
from dateutil import parser

from models import (PromoterModel, UserModel, RevokedTokenModel, Event, EventInfo, EventType, EventImage, Location, UserSchema, UserSchemaWithoutPass, PromoterSchema, LocationSchema, EventSchema, EventInfoSchema, EventTypeSchema, EventImageSchema)
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
        text = args['text']
        start_date = args['start_date']
        end_date = args['end_date']
        location = {
            "country_code" : args['country_code'],
            "administrative_area" : args['administrative_area'],
            "locality": args['locality'],
            "postal_code": args['postal_code'],
            "thoroughfare": args['thoroughfare']
        }
        event_types = args['event_types'][1:-1].split(','); #remove braces and parentheses and split the string into an array by commas
        #convert string 'true' or 'false' to boolean value for boolean fields. If the value is neither 'true' or 'false', just enter None.
        series = True if args['series'] == 'true' else (False if args['series'] == 'false' else None)
        ticketed = True if args['ticketed'] == 'true' else (False if args['ticketed'] == 'false' else None)
        private = True if args['private'] == 'true' else (False if args['private'] == 'false' else None)
        #get list of event_info ids of event_infos matching the search query
        event_ids = EventInfo.search(text,start_date,end_date,location,event_types,series,ticketed,private)
        if not event_ids:
            return {'message':'There are no events matching that description. Please try something else.'}

        try:
            return event_ids
        except:
            return {'message':'Something went wrong.'},500



#return all the data of one event_info and all of its events. Query based on id #.
class OneEvent(Resource):
    def get(self, id):
        #get the right event_info
        event_info = EventInfo.find_by_id(id)
        # ids = []
        # for event in event_info.events:
        #     ids.append(event.id)
        # print(str(id) + " Has: "+str(ids))
        if not event_info:
            return {'message': 'An event with that id does not exist.'}
        #serialize event_info
        event_info_dump = event_info_schema.dump(event_info)

        #return the results
        try:
            return event_info_dump
        except:
            return {'message': 'Something went wrong.'}, 500
    @jwt_required
    def delete(self, id):
        #get the name of the promoter that we're trying to update
        event_info = EventInfo.find_by_id(id)
        if not event_info:
            return {'message': 'An event with that id does not exist.'}
        #get the name of the user trying to do the updating
        current_user_name = get_jwt_identity()
        user = UserModel.find_by_username(current_user_name)
        #return a helpful message if the user is trying to edit an account which is not their own
        if not user.promoter_name == event_info.promoter_name:
            return {'message': 'That event belongs to another promoter account; you are not authorized to delete it.'}

        db_session.delete(event_info)
        db_session.commit()
        return {'message': 'Event #{} was deleted.'.format(id)}

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

        #convert all datetime strings into strings which marshmallow can load (marshmallow requires ISO 8601 format INCLUDING SECONDS)
        for i in range(len(data['events'])):
            try:
                data['events'][i]['start_date'] = str(parser.parse(data['events'][i]['start_date']))
            except:
                data['events'][i]['start_date'] = None
            try:
                data['events'][i]['end_date'] = str(parser.parse(data['events'][i]['end_date']))
            except:
                data['events'][i]['end_date'] = None

        # create event_info out of json
        event_info = event_info_schema.load(data)
        print(event_info.errors) #for debugging
        new_event_info = EventInfo(
            name = event_info.data['name'],
            pro_pic_url = event_info.data['pro_pic_url'],
            description = event_info.data['description'],
            series = event_info.data['series'],
            ticketed = event_info.data['ticketed'],
            private = event_info.data['private']
        )

        # create associated event(s) out of nested object(s), single if single plural else
        events = event_info.data['events']
        for i in range(len(events)):
            location = Location(
                country_code = events[i]['location']['country_code'],
                administrative_area = events[i]['location']['administrative_area'],
                locality = events[i]['location']['locality'],
                postal_code = events[i]['location']['postal_code'],
                thoroughfare = events[i]['location']['thoroughfare']
            )
            new_event = Event(
                start_date = events[i]['start_date'],
                end_date = events[i]['end_date'],
                location = location
            )
            # append created Events to created event_info
            new_event_info.events.append(new_event)

        # create associated event type(s) out of nested object(s), single if single plural else
        event_types = event_info.data['event_types']
        for i in range(len(event_types)):
            new_event_type = EventType(
                type = event_types[i]['type']
            )
            # append created Events to created event_info
            new_event_info.event_types.append(new_event_type)

        # create associated event image(s) out of nested object(s), single if single plural else
        event_images = event_info.data['event_images']
        for i in range(len(event_images)):
            new_event_image = EventImage(
                img = event_images[i]['img'],
                description = event_images[i]['description']
            )
            # append created Events to created event_info
            new_event_info.event_images.append(new_event_image)

        # append create event_info to promoter of current user
        promoter = PromoterModel.find_by_name(current_user_promoter)
        promoter.event_infos.append(new_event_info)

        # try:
        new_event.save_to_db()
        new_event_info.save_to_db()
        promoter.save_to_db()
        #return json serialized promoter's list of event_ids, which now includes the new event
        ret = promoter_schema.dump(promoter)
        return ret.data['event_infos']
        # except:
        # return {'message': 'Something went wrong'}, 500



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
class AllEvents(Resource):
    def delete(self):
        return EventInfo.delete_all()


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
