from database import Base, db_session
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from passlib.hash import pbkdf2_sha256 as sha256
from marshmallow import Schema, fields

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

class LocationSchema(Schema):
    country_code = fields.Str(missing=None)
    administrative_area = fields.Str(missing=None)
    locality = fields.Str(missing=None)
    postal_code = fields.Str(missing=None)
    thoroughfare = fields.Str(missing=None)

class EventTypeSchema(Schema):
    type = fields.Str(missing=None)
    event_name = fields.Str()

class EventSchema(Schema):
    start_date = fields.DateTime(missing=None)
    end_date = fields.DateTime(missing=None)
    location = fields.Nested(LocationSchema, many=False, missing={})
    event_name = fields.Str()

class EventInfoSchema(Schema):
    id = fields.Integer()
    name = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    series = fields.Bool(missing=False)
    ticketed = fields.Bool(missing=False)
    private = fields.Bool(missing=False)
    #relationships
    events = fields.Nested(EventSchema, many=True)
    event_types = fields.Nested(EventTypeSchema, many=True, missing=[{}])
    promoter_name = fields.Str()

class PromoterSchema(Schema):
    name = fields.Str(error_messages = {'required':'This field cannot be left blank'}, required = True)
    users = fields.Nested(UserSchema, only=['username'], many=True)
    event_infos = fields.Nested(EventInfoSchema, only=['id'], many=True)



# Event models
'''
One model (EventInfo) has most of the important fields,
another (Event) has all of the date and location info.

The eventinfo to event relationship is one to many.
There is another one to many join for event types, and another for images.
'''
class Location(Base):
    __tablename__ = 'Location'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey('event.id'))

    country_code = Column(String(2))
    administrative_area = Column(String(120)) #state/province
    locality = Column(String(120)) #city/town
    postal_code = Column(String(120))
    thoroughfare = Column(String(120)) #street address

    event = relationship("Event", back_populates="location")

class EventType(Base):
    __tablename__ = 'event_type'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key = True)
    event_info_id = Column(Integer, ForeignKey('event_info.id'))

    type = Column(String(120))

    event_info = relationship("EventInfo", back_populates="event_types")

class Event(Base):
    __tablename__ = 'event'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key = True)
    event_id = Column(Integer, ForeignKey('event_info.id'))
    #====Date====#
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    event_info = relationship("EventInfo", back_populates="events")
    location = relationship("Location", uselist=False, back_populates="event")

    def save_to_db(self):
        db_session.add(self)
        db_session.commit()

    @classmethod
    def find_by_id(cls, id):
       return cls.query.filter_by(id = id).first()

class EventInfo(Base):
    __tablename__ = 'event_info'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key = True)
    name = Column(String(120), nullable = False)
    series = Column(Boolean, default=False)
    ticketed = Column(Boolean, default=False)
    private = Column(Boolean, default=False)
    promoter_name = Column(String(120), ForeignKey('promoters.name'))

    event_types = relationship("EventType", order_by=EventType.id, back_populates="event_info")
    events = relationship("Event", order_by=Event.id, back_populates="event_info")
    promoter = relationship("PromoterModel", back_populates="event_infos")
    #event images

    def save_to_db(self):
        db_session.add(self)
        db_session.commit()

    @classmethod
    def find_by_name(cls, name):
       return cls.query.filter_by(name = name).first()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id = id).first()

    @classmethod
    def search(cls,name,start_date,end_date,location,event_types,series,ticketed,private):
        #return results based on names, dates, locations, types, and/or whether series, ticketed, and/or private. None of the fields are required.
        search = EventInfo.query
        #name: returns a list of events with similar names
        if name:
            search = search.filter(EventInfo.name.ilike('%'+name+'%'))
        #dates: filter out event_infos with no nested event that has start and end dates which fall within the provided date range
        if start_date:
            search = search.filter(EventInfo.events.any(Event.start_date >= start_date))
        if end_date:
            search = search.filter(EventInfo.events.any(Event.end_date <= end_date))
        #locations: nested so that one can only search by administrative_area if they are also searching by country_code, etc.
        if location['country_code']:
            search = search.filter(EventInfo.events.any(Event.location.has(Location.country_code == location['country_code'])))
            if location['administrative_area']:
                search = search.filter(EventInfo.events.any(Event.location.has(Location.administrative_area.ilike('%'+location['administrative_area']+'%'))))
                if location['locality']:
                    search = search.filter(EventInfo.events.any(Event.location.has(Location.locality.ilike('%'+location['locality']+'%'))))
                    if location['postal_code']:
                        search = search.filter(EventInfo.events.any(Event.location.has(Location.postal_code == location['postal_code'])))
                        if location['thoroughfare']:
                            search = search.filter(EventInfo.events.any(Event.location.has(Location.thoroughfare.ilike('%'+location['thoroughfare']+'%'))))
        #types: Compares the query list to the event list. Exact
        if event_types[0]:
            for type in event_types:
                search = search.filter(EventInfo.event_types.any(EventType.type == type))
        #series, ticketed, private: boolean values, exact. Only filter if the value exists, otherwise ignore.
        #This means that null strings can be skipped
        if series != None:
            print(series)
            search = search.filter(EventInfo.series.is_(series))
        if ticketed:
            search = search.filter(EventInfo.ticketed.is_(True))
        if private:
            search = search.filter(EventInfo.private.is_(True))

        return search.with_entities(EventInfo.id).distinct().all() #return only ids, not whole objects. Distinct avoids duplicates



#represents users
class UserModel(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key = True)
    username = Column(String(120), unique = True, nullable = False)
    password = Column(String(120), nullable = False)
    firstName = Column(String(120))
    lastName = Column(String(120))
    email = Column(String(120))
    phoneNumber = Column(String(120))
    proPicUrl = Column(String(120))
    organization = Column(String(120))
    promoter_name = Column(String(120), ForeignKey('promoters.name'))

    promoter = relationship("PromoterModel", back_populates="users")

    def save_to_db(self):
        db_session.add(self)
        db_session.commit()

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
            num_rows_deleted = db_session.query(cls).delete()
            db_session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


class PromoterModel(Base):
    __tablename__ = 'promoters'

    id = Column(Integer, primary_key = True)
    name = Column(String(120), unique = True, nullable = False)

    users = relationship("UserModel", order_by=UserModel.id, back_populates="promoter")
    event_infos = relationship("EventInfo", order_by=EventInfo.id, back_populates="promoter")

    def save_to_db(self):
        db_session.add(self)
        db_session.commit()

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
class RevokedTokenModel(Base):
    __tablename__ = 'revoked_tokens'
    id = Column(Integer, primary_key = True)
    jti = Column(String(120))

    def add(self):
        db_session.add(self)
        db_session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)
