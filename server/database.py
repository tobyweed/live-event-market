import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

#'ssl':{'ca':'amazon-rds-ca-cert.pem','cert':'amazon-rds-ca-cert.pem'}
#connect_args={'ssl':{'mode':'preferred'}}
engine = create_engine(os.environ['DATABASE_URL'])
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    from models import UserModel, RevokedTokenModel, PromoterModel, EventInfo, Event
    Base.metadata.create_all(bind=engine)
