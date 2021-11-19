from api.tests.unit_tests.utils import *

class CustomUserTest(APITestCase):
	def setUp(self):
		todo = False

	def test_get_user_model(self):
		user1 = get_user_model().objects.create_user(
            username="AAAAAA",
            email="CCCCC@CCC.CCC",
            password="AAAAAAC",
            first_name="AAAAAA",
            last_name="AAAew"
        )
		# set_query_workspace = Workspace.objects.filter(members__username=user1.username)
		print(Workspace.objects.values_list())
		print(WorkspaceMembership.objects.values_list())
		self.assertEqual(True,True)
