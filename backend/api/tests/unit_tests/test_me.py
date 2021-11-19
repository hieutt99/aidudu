from api.tests.unit_tests.utils import *

class MeTest(APITestCase):
    url = reverse("me")

    def setUp(self):
        self.username = "john"
        self.email = "john@snow.com"
        self.password = "you_know_nothing"        
        # print(hash_password(self.password))
        '''
        UserRegisterSerializer.object.create({
            "username":self.username,
            "email":self.email,
            "password":hash_password(self.password),
            "first_name":self.username,
            "last_name":self.username})
        '''
        hook_init_APITestCase(self)
        

    
    def api_authentication(self):
        data = base64.b64encode(f'{self.username}:{self.password}'.encode()).decode()
        self.client.credentials(HTTP_AUTHORIZATION=f"Basic {data}")
        # print(self.client.__dict__)
        # self.client.force_authenticate
        self.client.HTTP_USER_AGENT='Mozilla/5.0'
        
    def test_success_get_info(self):
        # data = base64.b64encode(f'{self.username}:{self.password}'.encode()).decode()
        resp = self.client.get(self.url)
        # print(resp.request)
        # print(resp.__dict__)
        # print(self.client.__dict__)
        # print(self.client.credentials())
        # print(dir(self.client))
        self.assertEqual(200, resp.status_code)
        all_field = list(resp.json().keys())
        some_field = ["id","last_login","is_superuser","username","first_name","last_name","is_staff","is_active","date_joined","email","avatar","bio","groups","user_permissions"]
        self.assertEqual(all_field, some_field)
    
    def test_not_found_get_info(self):
        self.client.force_authenticate(user=None,token=None)
        # self.client.session.auth = HTTPBasicAuth('user', 'pass')
        resp = self.client.get(self.url,)
        self.assertEqual(401, resp.status_code)
