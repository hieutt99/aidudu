from api.tests.unit_tests.utils import *

# 1 file 1 cladss ....
class AuthLoginTest(APITestCase):
	url = reverse("login")
	def setUp(self):
		self.username = "john"
        self.email = "john@snow.com"
        self.password = "you_know_nothing"        
		

class AuthRefreshTest(APITestCase):
	url = reverse("refresh")
	def setUp(self):


class AuthRegisterTest(APITestCase):
	url = reverse("register")
	def setUp(self):
		

class AuthForgotPasswordTest(APITestCase):
	url = reverse("forgot-password")
	def setUp(self):
		
		


