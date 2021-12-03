from django.test import Client
from api.tests.unit_tests.utils import *

class TestItems(APITestCase):
    def setUp(self):
        hook_init_APITestCase(self)

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
            user=self.me,
            card=self.test_card[0]
        )

        self.test_checklist = Checklist.objects.create(
            card=self.test_card[0],
            title='This is a checklist',
        )

        self.test_item = ChecklistItem.objects.create(
            checklist=self.test_checklist,
            content='This is an item'
        )

    def test_get_items_in_checklist(self):
        resp = self.client.get(reverse('checklist_item-list') + '?checklist=' + str(self.test_checklist.id))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data[0]['content'], self.test_item.content)
        self.assertEqual(resp.data[0]['checklist'], self.test_checklist.id)

    def test_create_item(self):
        data = {
            'checklist': self.test_checklist.id,
            'content': 'new item'
        }
        resp = self.client.post(reverse('checklist_item-list'), data=data)
        self.assertEqual(resp.status_code, 201)

    def test_update_item(self):
        data = {
            'content': 'modified content',
            'checked': True
        }       
        resp = self.client.put(reverse('checklist_item-detail', args=[self.test_item.id]), data=data)
        self.assertEqual(resp.status_code, 200)
        resp = self.client.get(reverse('checklist_item-detail', args=[self.test_item.id]))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['content'], 'modified content')
        self.assertEqual(resp.data['checked'], True)

    def test_delete_item(self):
        resp = self.client.delete(reverse('checklist_item-detail', args=[self.test_item.id]))
        self.assertEqual(resp.status_code, 204)