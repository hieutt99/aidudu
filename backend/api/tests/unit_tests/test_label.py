import random
from api.tests.unit_tests.utils import *


class LabelTest(APITestCase):
    
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
            username="songoku1930",
            email="chichi362@songo.han",
            password="FRIEZA" 
        )
        tmp_workspacemembership = WorkspaceMembership.objects.get(user=self.other_user.id)
        self.other_user_workspace =  Workspace.objects.get(id=tmp_workspacemembership.workspace.id)
        self.other_user_board = Board.objects.create(name=hex(0xdead),background='',workspace=self.other_user_workspace)
        # create label card relation 
        self.CardMember_relationship = [CardMembership.objects.create(card=card,user=self.other_user) for card in self.my_board_0_list_card] + [CardMembership.objects.create(card=card,user=self.me) for _,card in zip(range(1),self.my_board_0_list_card)]
        self.my_board_0_Label_list = [Label.objects.create(board=self.list_my_board[0],name=f'goku episode {i}',color=color) for i,color in zip(range(100),[Label.COLOR.TOMATO,Label.COLOR.FLAMINGO,Label.COLOR.TANGERINE,Label.COLOR.BANANA,Label.COLOR.SAGE,Label.COLOR.BASIL,Label.COLOR.PEACOCK])]
        self.my_board_1_Label_list = [Label.objects.create(board=self.list_my_board[1],name=f'goku episode XXX',color=Label.COLOR.BASIL)]
        self.CardLabel_relationship = [CardLabelRelationship.objects.create(card=card,label=random.choice(self.my_board_0_Label_list)) for _,card in zip(range(2),self.my_board_0_list_card)] # + [CardLabelRelationship.objects.create(card=self.my_board_0_list_card[0],label=random.choice(self.my_board_0_Label_list))]
        
        # print(Workspace.objects.values_list())
        # print(Board.objects.values_list())
        # print(List.objects.values_list())
        # print(Card.objects.values_list())
        # print(Label.objects.values_list())
        # print(CardMembership.objects.values_list())
        # print(CardLabelRelationship.objects.values_list())
    
    def test_success_get_label(self):
        resp = self.client.get(reverse("label-detail",args=[self.my_board_0_Label_list[2].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        tmp = {"id":self.my_board_0_Label_list[2].id,"name":self.my_board_0_Label_list[2].name,"color":self.my_board_0_Label_list[2].color,"board":self.my_board_0_Label_list[2].board.id} 
        self.assertEqual(resp.json(),tmp)

    def test_success_get_labels(self):
        resp = self.client.get(reverse("label-list"))
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        self.assertEqual(len(resp.json()),len(self.my_board_1_Label_list)+len(self.my_board_0_Label_list))

    def test_success_create_label(self):
        data = {
            "board":self.list_my_board[1].id,
            "name":"test_create",
            "color":"tomato"
        }
        resp = self.client.post(reverse("label-list"),data=data)
        self.assertEqual(201,resp.status_code)
        # print(resp.status_code,resp.content)
        resp = self.client.get(reverse("label-list"))
        self.assertEqual(200,resp.status_code)
        self.assertEqual(len(resp.json()),len(self.my_board_1_Label_list)+len(self.my_board_0_Label_list)+1)

    def test_fail_create_label(self):
        data = {
            "board":0xdeadbeef,
            "name":"test_create",
            "color":"tomato"
        }
        resp = self.client.post(reverse("label-list"),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(400,resp.status_code)
        self.assertEqual(resp.json(),{"board":[f'Invalid pk "{0xdeadbeef}" - object does not exist.']})

        data = {
            "board":self.other_user_board.id,
            "name":"test_create",
            "color":"tomato"
        }
        resp = self.client.post(reverse("label-list"),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(403,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"You do not belong to this board or this board doesn't exist."})

    def test_fail_create_label_for_card(self):
        data = {
            "board": self.other_user_board.id,
            "name" : "test_create",
            "color": "tomato",
            "card" : "2"
        }
        resp = self.client.post(reverse("label-list"),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(403,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"You do not belong to this board or this board doesn't exist."})
        data = {
            "board": self.list_my_board[1].id,
            "name" : "test_create",
            "color": "tomato",
            "card" : self.my_board_0_list_card[0].id
        }
        resp = self.client.post(reverse("label-list"),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(403,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"This label already has label."})
        
        data = {
            "board": self.list_my_board[1].id,
            "name" : "test_create",
            "color": "tomato",
            "card" : self.my_board_0_list_card[2].id
        }
        resp = self.client.post(reverse("label-list"),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(403,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"You can not create label for this card."})
        

    def test_success_create_label_for_card(self):
        data = {
            "board": self.list_my_board[0].id,
            "name" : "test_create",
            "color": "tomato",
            "card" : self.my_board_0_list_card[2].id
        }
        resp = self.client.post(reverse("label-list"),data=data)
        self.assertEqual(201,resp.status_code)
        self.assertEqual(len(resp.json()),len(["id","name","color","board"]))
        # print(resp.status_code,resp.content)

    def test_success_update_label(self):
        data ={
            "board":self.my_board_0_Label_list[3].board.id,
            "name":"testasd asdsad update hehe",
            "color":"tomato"
        } 
        resp = self.client.put(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(200,resp.status_code)
        data['id']=self.my_board_0_Label_list[1].id
        self.assertEqual(resp.json(),data)
        # {"id":1,"name":"testasd asdsad update hehe","color":"tomato","board":1}
        # check data update 
        resp = self.client.get(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(resp.json(),data)

    def test_fail_update_label(self):
        ## invalid label
        data ={
            "board":self.my_board_0_Label_list[3].board.id,
            "name":"testasd asdsad update hehe",
            "color":"tomato"
        } 
        resp = self.client.put(reverse("label-detail",args=[0xdeadbeef]),data=data)
        # print(resp.status_code,resp.content)
        self.assertEqual(404,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"Not found."})
        ## invalid board
        data ={
            "board":0xdeadbeef,
            "name":"testasd asdsad update hehe",
            "color":"tomato"
        } 
        resp = self.client.put(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]),data=data)        
        self.assertEqual(400,resp.status_code)
        self.assertEqual(resp.json(),{"board":[f'Invalid pk "{0xdeadbeef}" - object does not exist.']})
        # print(resp.status_code,resp.content)
        ## invalid color 
        color = "COCOCOCOC"
        data ={
            "board":self.my_board_0_Label_list[3].board.id,
            "name":"testasd asdsad update hehe",
            "color":color
        } 
        resp = self.client.put(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]),data=data)        
        # print(resp.status_code,resp.content)
        self.assertEqual(400,resp.status_code)
        self.assertEqual(resp.json(),{"color":[f'"{color}" is not a valid choice.']})

    def test_success_delete_label(self):
        resp = self.client.delete(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(204,resp.status_code)
        ## check delete 
        resp = self.client.get(reverse("label-detail",args=[self.my_board_0_Label_list[1].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(404,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"Not found."})

    def test_fail_delete_label(self):
        resp = self.client.delete(reverse("label-detail",args=[0xffff]))
        self.assertEqual(404,resp.status_code)
        self.assertEqual(resp.json(),{"detail":"Not found."})
