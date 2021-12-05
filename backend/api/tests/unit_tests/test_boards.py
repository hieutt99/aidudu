from api.tests.unit_tests.utils import *

'''
GET api/v1/boards/?workspace=[int]&recent=[bool]&starred=[bool]&limit=[int]&user_id=[int?]
authorization: Basic base64([username]:[password])

'''
class BoardsTest(APITestCase):
    # url = reverse("board")
    def setUp(self):
        hook_init_APITestCase(self)

    def test_success_delete_board(self):
        todo = False

    def test_success_create_board(self):
        todo = False

    def test_success_get_all_boards(self):
        todo = False
        # resp = self.client.get(self.url)
        # self.assertEqual(200, resp.status_code)
        # self.assertEqual(list, type(resp.json()))

    def test_success_get_recent_boards(self):
        todo=False



