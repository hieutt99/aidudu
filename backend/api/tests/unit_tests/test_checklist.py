import random
from api.tests.unit_tests.utils import *


class ChecklistsTest(APITestCase):

    def setUp(self):
        hook_init_APITestCase(self)
        tmp_workspacemembership = WorkspaceMembership.objects.get(user=self.me.id)
        self.my_workspace = Workspace.objects.get(id=tmp_workspacemembership.workspace.id)
        # emulate user create board 
        self.list_my_board = [Board.objects.create(name=hex(i),background='',workspace=self.my_workspace) for i in range(0x4141,0x4143)]
        # me create broard is should synchronize with BoardMembership ()
        self.my_boardmembership = [BoardMembership.objects.create(user=self.me,board=board,starred=(True if i else False)) for i,board in zip(range(2),self.list_my_board)]
        # create list some board 
        
        self.my_list_eachboard = {self.list_my_board[0].id:[
            List.objects.create(name='lubu',board=self.list_my_board[0]),
            List.objects.create(name='lobo',board=self.list_my_board[0],position=1,archived=True)
        ]}
        # create some card each list 
        self.my_cards_eachlist = {self.my_list_eachboard[self.list_my_board[0].id][0].id:[
            Card.objects.create(
                list=self.my_list_eachboard[self.list_my_board[0].id][0],
                title="putty",
                description="ZZZZZZ",
            ),
            Card.objects.create(
                list=self.my_list_eachboard[self.list_my_board[0].id][0],
                title="putta",
                description="YYYYY",
                position=1
            ),
            Card.objects.create(
                list=self.my_list_eachboard[self.list_my_board[0].id][0],
                title="bunta",
                description="XXXXX",
                position=2
            ),
        ]}
        self.my_board_0_list_card = self.my_cards_eachlist[self.my_list_eachboard[self.list_my_board[0].id][0].id]
        # create other user 
        self.other_user = CustomUser.objects.create_user(
            username="ronaldo",
            email="lukaku@fernandes.werner",
            password="DeBruyne" 
        )
        tmp_workspacemembership = WorkspaceMembership.objects.get(user=self.other_user.id)
        self.other_user_workspace =  Workspace.objects.get(id=tmp_workspacemembership.workspace.id)
        self.other_user_board = Board.objects.create(name=hex(0xdead),background='',workspace=self.other_user_workspace)
        # create label card relation 
        self.CardMember_relationship = [CardMembership.objects.create(card=card,user=self.other_user) for card in self.my_board_0_list_card] + [CardMembership.objects.create(card=card,user=self.me) for _,card in zip(range(1),self.my_board_0_list_card)]
        self.my_board_0_Label_list = [Label.objects.create(board=self.list_my_board[0],name=f'label {i}',color=color) for i,color in zip(range(100),[Label.COLOR.TOMATO,Label.COLOR.FLAMINGO,Label.COLOR.TANGERINE,Label.COLOR.BANANA,Label.COLOR.SAGE,Label.COLOR.BASIL,Label.COLOR.PEACOCK])]
        self.my_board_1_Label_list = [Label.objects.create(board=self.list_my_board[1],name=f'label XXX',color=Label.COLOR.BASIL)]
        self.CardLabel_relationship = [CardLabelRelationship.objects.create(card=card,label=random.choice(self.my_board_0_Label_list)) for _,card in zip(range(2),self.my_board_0_list_card)] # + [CardLabelRelationship.objects.create(card=self.my_board_0_list_card[0],label=random.choice(self.my_board_0_Label_list))]
        
        # checklist 
        self.my_checklist = [Checklist.objects.create(card=card,title=f'checklist {i}',position=i) for i,card in zip(range(1),self.my_board_0_list_card) ]
        self.my_checklist.append(Checklist.objects.create(card=self.my_board_0_list_card[0],title=f'checklist {len(self.my_checklist)}',position=len(self.my_checklist)))

        # print(Workspace.objects.values_list())
        # print(Board.objects.values_list())
        # print(List.objects.values_list())
        # print(Card.objects.values_list())
        # print(Label.objects.values_list())
        # print(CardMembership.objects.values_list())
        # print(CardLabelRelationship.objects.values_list())
        # print(Checklist.objects.values_list())
    
    def test_success_get_all_checklists_from_a_card(self):  
        resp = self.client.get(reverse("checklist-list")+f"?card={self.my_board_0_list_card[0].id}")
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        tmp = [{"id":checklist.id,"title":checklist.title,"position":checklist.position,"card":checklist.card.id} for checklist in self.my_checklist]
        self.assertEqual(resp.json(),tmp)

    def test_fail_get_all_checklists_from_a_card(self):  
        # test card not found
        resp = self.client.get(reverse("checklist-list")+f"?card={0xdeadbeaf}")
        ## Hmm return 200???
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        self.assertEqual(resp.json(),[])

    def test_success_create_checklist(self):
        data = {
            "card": self.my_board_0_list_card[0].id,
            "title": "This is a checklist"
        }
        resp = self.client.post(reverse("checklist-list"),data=data)
        # print(resp.status_code,resp.content)        
        self.assertEqual(201,resp.status_code)
        # self.assertEqual(len(resp.json()),len())
        resp = self.client.get(reverse("checklist-list")+f"?card={self.my_board_0_list_card[0].id}")
        # print(resp.status_code,resp.content)        
        self.assertEqual(len(resp.json()),len(self.my_checklist)+1)

    def test_fail_create_checklist(self):
        tmp = 0xdeadbeef
        data = {
            "card": tmp,
            "title": "This is a checklist"
        }
        resp = self.client.post(reverse("checklist-list"),data=data)
        # print(resp.status_code,resp.content)        
        tmp = {"card":[f'Invalid pk "{tmp}" - object does not exist.']}
        self.assertEqual(400,resp.status_code)
        self.assertEqual(tmp,resp.json())

    def test_success_update_checklist(self):
        # Failed Not implement update
        data = {
            "title": "This is a new title"
        }
        resp = self.client.patch(reverse("checklist-detail",args=[self.my_checklist[0].id]),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        tmp_checklist = self.my_checklist[0]
        tmp = {"id":tmp_checklist.id,"title":"This is a new title","position":tmp_checklist.position,"card":tmp_checklist.card.id}
        resp = self.client.get(reverse("checklist-detail",args=[self.my_checklist[0].id]))
        self.assertEqual(resp.json(),tmp)

    def test_fail_update_checklist(self):
        tmp = 0xdeadbeef
        data = {
            "title": "This is a new title"
        }
        # resp = self.client.patch(reverse("checklist-list")+f"?card={tmp}",data=data)
        resp = self.client.patch(reverse("checklist-detail",args=[tmp]),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(404,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"Not found."})

    def test_success_delete_checklist(self):
        resp = self.client.delete(reverse("checklist-detail",args=[self.my_checklist[0].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(204,resp.status_code)
        resp = self.client.get(reverse("checklist-list")+f"?card={self.my_board_0_list_card[0].id}")
        self.assertEqual(len(resp.json()),len(self.my_checklist)-1)

    def test_fail_delete_checklist(self):
        tmp = 0xdeadbeef
        resp = self.client.delete(reverse("checklist-detail",args=[tmp]))
        # print(resp.status_code,resp.content)
        self.assertEqual(404,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"Not found."})
