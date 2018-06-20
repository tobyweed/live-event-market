from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256 as sha256
from marshmallow import Schema, fields
from flask_whooshee import Whooshee

whooshee = Whooshee()
db = SQLAlchemy() #Necessary to declare this here instead of server to avoid circular imports


#declare schemas
class UserSchema(Schema):
    username = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    password = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    firstName = fields.Str(missing=None)
    lastName = fields.Str(missing=None)
    email = fields.Str(missing=None)
    phoneNumber = fields.Str(missing=None)
    proPicUrl = fields.Str(missing=None)
    organization = fields.Str(missing=None)
    promoter_name = fields.Str()

#userschema without the password, used to send user information back and forth from the client
class UserSchemaWithoutPass(Schema):
    username = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    firstName = fields.Str(missing=None)
    lastName = fields.Str(missing=None)
    email = fields.Str(missing=None)
    phoneNumber = fields.Str(missing=None)
    proPicUrl = fields.Str(missing=None)
    organization = fields.Str(missing=None)
    promoter_name = fields.Str()

class PromoterSchema(Schema):
    name = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    users = fields.Nested(UserSchema, only=['username'], many=True)

class EventSchema(Schema):
    start_date = fields.DateTime()
    end_date = fields.DateTime()
    event_name = fields.Str()

class EventInfoSchema(Schema):
    name = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    events = fields.Nested(EventSchema, many=True)
    promoter_name = fields.Str()



# Event models
'''
One model (EventInfo) has most of the important fields,
another (Event) has all of the date and location info.

The eventinfo to event relationship is one to many.
There is another one to many join for event types, and another for images.
'''

class Event(db.Model):
    __tablename__ = 'event'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key = True)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    event_id = db.Column(db.Integer, db.ForeignKey('event_info.id'))

    event_info = db.relationship("EventInfo", back_populates="events")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, id):
       return cls.query.filter_by(id = id).first()

@whooshee.register_model('name')
class EventInfo(db.Model):
    __tablename__ = 'event_info'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), nullable = False)
    promoter_name = db.Column(db.String(120), db.ForeignKey('promoters.name'))

    events = db.relationship("Event", order_by=Event.id, back_populates="event_info")
    promoter = db.relationship("PromoterModel", back_populates="event_infos")
    #event type
    #event images

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
       return cls.query.filter_by(name = name).first()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id = id).first()

    @classmethod
    def search(cls,name,start_date,end_date):
        #return results based on names, dates, locations, types, and/or whether series, ticketed, and/or private. None of the fields are required.
        #names: returns a list of events with similar names
        if name and (len(name) >= 3):
            search = EventInfo.query.whooshee_search(name)
        else:
            search = EventInfo.query
        #dates: filter out event_infos with no nested event that has start and end dates which fall within the provided date range
        if start_date:
            search = search.filter(Event.start_date <= start_date)
        if end_date:
            search = search.filter(Event.end_date >= end_date)
        #locations: proximity, if possible
        #types: Compares the query list to the event list. Exact
        #series, ticketed, private: boolean values, exact
        return search.all()



#represents users
class UserModel(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)
    firstName = db.Column(db.String(120))
    lastName = db.Column(db.String(120))
    email = db.Column(db.String(120))
    phoneNumber = db.Column(db.String(120))
    proPicUrl = db.Column(db.String(120))
    organization = db.Column(db.String(120))
    promoter_name = db.Column(db.String(120), db.ForeignKey('promoters.name'))

    promoter = db.relationship("PromoterModel", back_populates="users")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
       return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


class PromoterModel(db.Model):
    __tablename__ = 'promoters'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), unique = True, nullable = False)

    users = db.relationship("UserModel", order_by=UserModel.id, back_populates="promoter")
    event_infos = db.relationship("EventInfo", order_by=EventInfo.id, back_populates="promoter")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
       return cls.query.filter_by(name = name).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'name': x.name
            }
        return {'users': list(map(lambda x: to_json(x), PromoterModel.query.all()))}



#for when a user logs out, so we can disable their keys
class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)
