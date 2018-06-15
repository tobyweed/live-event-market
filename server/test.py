import unittest
import server
import json
from flask import jsonify
from datetime import datetime
from endpoints import user_schema, DateTimeEncoder
from models import UserModel, EventInfo, Event, PromoterModel

TEST_SQLALCHEMY_DATABASE_URI = 'sqlite:///test.sqlite'

#Set up and tear down database after all tests have run
def setUpModule():
    print("setUpModule")
    server.app.config['SQLALCHEMY_DATABASE_URI'] = TEST_SQLALCHEMY_DATABASE_URI
    server.app.config['WHOOSHEE_MEMORY_STORAGE'] = True
    server.app.testing = True
    with server.app.app_context():
        server.db.init_app(server.app)
        server.whooshee.init_app(server.app)

def tearDownModule():
    with server.app.app_context():
        server.db.drop_all()


#parent class to provide methods
class AuthTest(unittest.TestCase):
    #set context and give a test user
    @classmethod
    def setUpClass(self):
        self.app = server.app.test_client()
        with server.app.app_context():
            self.register('test','test')
            self.registerPromoter('test','test','test')
            self.createEvent('test',datetime.now(),'test','test')

    #clean the db after every test
    @classmethod
    def tearDownClass(self):
        with server.app.app_context():
            server.db.session.remove()

    @classmethod
    def register(self, username, password):
        return self.app.post('/registration', json={
            'username':username,
            'password':password
        }, follow_redirects=True)

    @classmethod
    def registerPromoter(self, name, username, password):
        token = self.getToken(username, password)
        return self.app.post('/promoters/registration', headers={
            'Content-Type':'application/json',
            'Authorization': 'Bearer {}'.format(token)
        }, json={
            'name':name
        }, follow_redirects=True)

    @classmethod
    def createEvent(self, name, start_date, username, password):
        token = self.getToken(username, password)
        start_date = json.dumps(start_date,cls=DateTimeEncoder)
        start_date = start_date.replace('"','')
        return self.app.post('/create-event', headers={
            'Content-Type':'application/json',
            'Authorization': 'Bearer {}'.format(token)
        }, json={
            'name':name,
            'events':[
                    {'start_date':start_date},
                    {'start_date':'2019-11-11T18:45:10.000000'}
                ]
            }, follow_redirects=True)

    @classmethod
    def getOneEvent(self, id, username, password):
        token = self.getToken(username, password)
        return self.app.get('/event/'+id, headers={
            'Content-Type':'application/json',
            'Authorization': 'Bearer {}'.format(token)
        }, follow_redirects=True)

    @classmethod
    def login(self, username, password):
        return self.app.post('/login', json={
            'username':username,
            'password':password
        }, follow_redirects=True)

    @classmethod
    def getToken(self, username, password):
        login_res = eval(self.login(username,password).data)
        token = login_res['access_token']
        return token

    @classmethod
    def oneUser(self, username, token):
        return self.app.get('/user/'+username, headers={
            'Content-Type':'application/json',
            'Authorization': 'Bearer {}'.format(token)
        }, follow_redirects=True)


'''
===================================TESTS========================================
'''
class RegisterTest(AuthTest):
    def test_register(self):
        rv = self.register('new_user','test')
        assert b'User new_user was created' in rv.data
        rv = self.register('test','test')
        assert b'User test already exists' in rv.data

class LoginTest(AuthTest):
    def test_login(self):
        rv = self.login('test','test')
        assert b'Logged in as test' in rv.data
        rv = self.login('not-real','test')
        assert b'User not-real doesn\'t exist' in rv.data
        rv = self.login('test','wrong-pass')
        assert b'Wrong credentials' in rv.data

class PermissionTest(AuthTest):
    def test_permission(self):
        token = self.getToken('test','test')
        rv = self.oneUser('test', token)
        user_from_server = json.loads(rv.data)
        with server.app.app_context():
            user_from_model = user_schema.dump(UserModel.find_by_username('test')).data
            self.assertEqual(user_from_server, user_from_model)

class EventModelTest(AuthTest):
    def test_models(self):
        new_event_info = EventInfo(
            name = 'test'
        )
        new_event = Event(
            start_date = datetime.now()
        )
        with server.app.app_context():
            promoter = PromoterModel.find_by_name('test')
            #add promoters/users
            promoter.event_infos.append(new_event_info)
            new_event_info.events.append(new_event)

            #commit changes
            new_event_info.save_to_db()
            new_event.save_to_db()

            #find the event entries
            event = Event.find_by_id(1)
            event_info = EventInfo.find_by_name('test')

            #test if the event_info to event relationship is established
            self.assertEqual(event_info.name, event.event_name)
            #test if  the event_info to promoter relationship is established
            self.assertEqual(event_info.promoter_name, promoter.name)

class EventCreationTest(AuthTest):
    def test_event_create(self):
        with server.app.app_context():
            #check that the server returns our affirmative message when we use the create event endpoint
            rv = self.createEvent('test1',datetime.now(),'test','test')
            assert b'Event test1 was created' in rv.data
            #check that our server returns an object at oneEvent endpoint with id 1 and it is named test
            rv1 = self.getOneEvent('1','test','test')
            event_info = json.loads(rv1.data)
            self.assertEqual(event_info['name'], 'test')

class SearchTest(AuthTest):
    def test_search(self):
        with server.app.app_context():
            rv = EventInfo.search('test')
            self.assertIsInstance(rv[0],EventInfo)


'''
TODO: Write tests for OneUser put, OnePromoter, AddUser,
and PromoterRegistration.
'''


#run
if __name__ == '__main__':
    suite1 = unittest.TestLoader().loadTestsFromTestCase(RegisterTest)
    suite2 = unittest.TestLoader().loadTestsFromTestCase(PermissionTest)
    suite3 = unittest.TestLoader().loadTestsFromTestCase(LoginTest)
    suite4 = unittest.TestLoader().loadTestsFromTestCase(EventModelTest)
    suite5 = unittest.TestLoader().loadTestsFromTestCase(EventCreationTest)
    suite6 = unittest.TestLoader().loadTestsFromTestCase(SearchTest)
    suite = unittest.TestSuite([suite1,suite2,suite3, suite4, suite5, suite6])
    unittest.TextTestRunner().run(suite)
