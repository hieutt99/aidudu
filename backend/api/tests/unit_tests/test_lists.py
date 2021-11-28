from re import S

from django.test.client import Client
from api.tests.unit_tests.utils import *


class ListTest(APITestCase):
    def setUp(self):
        hook_init_APITestCase(self)
        # create test objects
        # self.me = CustomUser.objects.create_user(
        #     username='testuser1',
        #     password='testpassword123'
        #     # default value for other fields
        # )
        # # self.me.set_password("testpassword123")
        # self.me.save()
        # login = self.client.login(username='testuser1', password='testpassword123')

        self.test_workspace = Workspace.objects.create(
            name='test_workspace',
            # default value for other fields
        )
        self.test_workspace.save()

        self.workspace_membership = WorkspaceMembership.objects.create(
            workspace=self.test_workspace,
            user=self.me,
            # default value for other fields
        )
        self.workspace_membership.save()

        self.test_board = Board.objects.create(
            name='test_board',
            workspace=self.test_workspace,
            # default value for other fields
        )
        self.test_board.save()

        self.board_membership = BoardMembership.objects.create(
            user=self.me,
            board=self.test_board,
            # default value for other fields
        )
        self.board_membership.save()

        self.test_list = [
            List.objects.create(
            name='test list 1',
            board=self.test_board
            # default value for other fields
        ),
            List.objects.create(
            name='target list 2',
            board=self.test_board
            # default value for other fields
        )]

        self.test_card = [Card.objects.create(
            list=self.test_list[0],
            title='test_card 1',
            description='This is card number 1'
            # default value for other fields
        ), 
            Card.objects.create(
            list=self.test_list[0],
            title='test_card 2',
            description='This is card number 2'
            # default value for other fields
        )]

        self.card_membership = CardMembership.objects.create(
            user=self.me,
            card=self.test_card[0]
        )

    def tearDown(self):
        if self.test_card is not None:
            for card in self.test_card:
                card.delete()
        if self.card_membership is not None:
            self.card_membership.delete()
        if self.workspace_membership is not None:
            self.workspace_membership.delete()
        if self.test_list is not None:
            for list in self.test_list:
                list.delete()
        if self.test_board is not None:
            self.test_board.delete()
        if self.test_workspace is not None:
            self.test_workspace.delete()
        if self.me is not None:
            self.me.delete()

    def test_add_new_list_to_board(self):
        data = {
            "name": "new list",
            "board": self.test_board.id
        }
        resp = self.client.post(reverse('list-list'), data=data)
        self.assertEqual(resp.status_code, 201)

    def test_get_a_list(self):
        resp = self.client.get(reverse('list-detail', args=[self.test_list[0].id]))
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.data['name'], self.test_list[0].name)

    def test_update_a_list(self):
        data = {
            "name" : "New list name",
            "board": self.test_board.id
        }
        resp = self.client.put(reverse('list-detail', args=[self.test_list[0].id]), data=data)
        self.assertEqual(resp.status_code, 200)
        # test if list is updated
        resp = self.client.get(reverse('list-detail', args=[self.test_list[0].id]))
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.data['name'], data['name'])

    def test_copy_a_list(self):
        resp = self.client.post(reverse('list-copy-a-list', args=[self.test_list[0].id]))
        self.assertEqual(resp.status_code, 204)

    def test_sort_cards_in_a_list(self):
        data = {
            "mode": 3
        }
        resp = self.client.post(reverse('list-sort-cards-in-list', args=[self.test_list[0].id]), data=data)
        self.assertEqual(resp.status_code, 204)

    def test_move_all_card_in_a_list(self):
        data = {
            'id': self.test_list[1].id
        }
        resp = self.client.post(reverse('list-move-all-cards', args=[self.test_list[0].id]), data=data)
        self.assertEqual(resp.status_code, 204)

    def test_archive_a_list(self):
        resp = self.client.post(reverse('list-archive-a-list', args=[self.test_list[0].id]))
        self.assertEqual(resp.status_code, 204)
    