from functools import partial
from re import S

from django.test.client import Client
from api.tests.unit_tests.utils import *

class TestComments(APITestCase):
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

        self.test_label = Label.objects.create(
            board=self.test_board,
            name='test label'
            # default value for other fields
        ) 
        self.test_label.save()

        self.test_comment = Comment.objects.create(
            card=self.test_card[0],
            user=self.me,
            content='This is a comment',
        )
    
    def test_get_comment_in_a_card(self):
        resp = self.client.get(reverse('comment-list') + '?card=' + str(self.test_card[0].id))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data[0]['content'], self.test_comment.content)

    def test_create_comment(self):
        data = {
            'card': self.test_card[0].id,
            'user': self.me.id,
            'content': "This is a new comment"
        }
        resp = self.client.post(reverse('comment-list'), data=data)
        self.assertEqual(resp.status_code, 201)

    def test_update_comment(self):
        data = {
            'content': "This is a modified comment"
        }
        resp = self.client.patch(reverse('comment-detail', args=[self.test_comment.id]), data=data)
        self.assertEqual(resp.status_code, 200)
        # test if comment is modified
        resp = self.client.get(reverse('comment-detail', args=[self.test_comment.id]))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data['content'], "This is a modified comment")

    def test_delete_comment(self):
        resp = self.client.delete(reverse('comment-detail', args=[self.test_comment.id]))
        self.assertEqual(resp.status_code, 204)
