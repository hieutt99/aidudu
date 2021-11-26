from django.test.client import BOUNDARY
from api.tests.unit_tests.utils import *


class CardTest(APITestCase):
    # url = reverse('card-detail')
    def setUp(self):
        hook_init_APITestCase(self)
        # create test objects
        self.test_user = CustomUser.objects.create(
            username='testuser1',
            password='testpwd123'
            # default value for other fields
        )
        self.test_user.save()

        self.test_workspace = Workspace.objects.create(
            name='test_workspace',
            # default value for other fields
        )
        self.test_workspace.save()

        self.workspace_membership = WorkspaceMembership.objects.create(
            workspace=self.test_workspace,
            user=self.test_user,
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
            user=self.test_user,
            board=self.test_board,
            # default value for other fields
        )

        self.test_list = List.objects.create(
            name='test_list',
            board=self.test_board
            # default value for other fields
        )
        self.test_list.save()

        test_card_1= Card.objects.create(
            list=self.test_list,
            title='test_card 1',
            description='This is card number 1'
            # default value for other fields
        )
        test_card_1.save()

        test_card_2= Card.objects.create(
            list=self.test_list,
            title='test_card 2',
            description='This is card number 2'
            # default value for other fields
        )
        test_card_2.save()

        self.test_card = [test_card_1, test_card_2]

        self.card_membership = CardMembership.objects.create(
            user=self.test_user,
            card=self.test_card[0]
        )

        self.test_label = Label.objects.create(
            board=self.test_board,
            name='test label'
            # default value for other fields
        ) 
        self.test_label.save()

    def tearDown(self):
        if self.test_card is not None:
            for card in self.test_card:
                card.delete()
        if self.card_membership is not None:
            self.card_membership.delete()
        if self.test_label is not None:
            self.test_label.delete()
        if self.workspace_membership is not None:
            self.workspace_membership.delete()
        if self.test_list is not None:
            self.test_list.delete()
        if self.test_board is not None:
            self.test_board.delete()
        if self.test_workspace is not None:
            self.test_workspace.delete()
        if self.test_user is not None:
            self.test_user.delete()

    def test_success_get_card(self):
        resp = self.client.get(reverse('card-detail', args=[self.test_card[0].id]))
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.data['title'], self.test_card[0].title)
        self.assertEqual(resp.data['description'], self.test_card[0].description)
        self.assertEqual(resp.data['list'], self.test_list.id)
    
    def test_success_create_card(self):
        data = {
            'list': self.test_list.id,
            'title': 'card 2',
            'description': 'This is card number 2'
        }
        resp = self.client.post(reverse('card-list'), data)
        self.assertEqual(201, resp.status_code)
 
    def test_success_update_card(self):
        data = {
            'list': self.test_list.id,
            'title': 'modified title',
            'description': 'modified desc'
        }
        resp = self.client.put(reverse('card-detail', args=[self.test_card[0].id]), data=data)
        self.assertEqual(200, resp.status_code)
        #check if card is updated
        resp = self.client.get(reverse('card-detail', args=[self.test_card[0].id]))
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.data['title'], 'modified title')
        self.assertEqual(resp.data['description'], 'modified desc')

    def test_success_add_label_card(self):
        data = {
            'id': self.test_label.id
        }
        resp = self.client.post(reverse('card-add-label-to-card', args=[self.test_card[0].id]), data=data)
        self.assertEqual(204, resp.status_code)

    def test_success_remove_label(self):
        data = {
            'id': self.test_label.id
        }
        resp = self.client.post(reverse('card-delete-label-from-card', args=[self.test_card[0].id]), data=data)
        self.assertEqual(204, resp.status_code)

    
    def test_success_add_member_card(self):
        data = {
            'id': self.test_user.id
        }
        resp = self.client.post(reverse('card-add-member-to-card', args=[self.test_card[1].id]), data=data)
        self.assertEqual(204, resp.status_code)
    
    def test_success_remove_member(self):
        data = {
            'id': self.test_user.id
        }
        resp = self.client.post(reverse('card-delete-member-from-card', args=[self.test_card[1].id]), data=data)
        self.assertEqual(204, resp.status_code)

    def test_success_delete_card(self):
        resp = self.client.delete(reverse('card-detail', args=[self.test_card[0].id]))
        self.assertEqual(204, resp.status_code)
        # check if card is deleted
        resp = self.client.get(reverse('card-detail', args=[self.test_card[0].id]))
        self.assertEqual(404, resp.status_code)