from api.tests.unit_tests.utils import *


class CardTest(APITestCase):
    url = reverse("card")
    def setUp(self):
        todo = False
    