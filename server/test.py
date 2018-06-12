import unittest
import server
import json
from endpoints import user_schema
from models import UserModel

TEST_SQLALCHEMY_DATABASE_URI = 'sqlite:///test.sqlite'

#Set up and tear down database after all tests have run
def setUpModule():
    print("setUpModule")
    server.app.config['SQLALCHEMY_DATABASE_URI'] = TEST_SQLALCHEMY_DATABASE_URI
    server.app.testing = True
    with server.app.app_context():
        server.db.init_app(server.app)

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

'''
TODO: Write tests for OneUser put, OnePromoter, AddUser,
and PromoterRegistration.
'''


#run
if __name__ == '__main__':
    suite1 = unittest.TestLoader().loadTestsFromTestCase(RegisterTest)
    suite2 = unittest.TestLoader().loadTestsFromTestCase(PermissionTest)
    suite3 = unittest.TestLoader().loadTestsFromTestCase(LoginTest)
    suite = unittest.TestSuite([suite1,suite2,suite3])
    unittest.TextTestRunner().run(suite)
