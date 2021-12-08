from api.tests.unit_tests.utils import *

'''
GET api/v1/boards/?workspace=[int]&recent=[bool]&starred=[bool]&limit=[int]&user_id=[int?]
authorization: Basic base64([username]:[password])

'''

class BoardsdetailTest(APITestCase):
    def setUp(self):
        hook_init_APITestCase(self)
        self.my_workspace = Workspace.objects.get(id=self.me.id)
        # emulate user create board 
        self.list_my_board = [Board.objects.create(name=hex(i),background='',workspace=self.my_workspace) for i in range(0x4141,0x4143)]
        # me create broard is should synchronize with BoardMembership ()
        self.my_boardmembership = [BoardMembership.objects.create(user=self.me,board=board) for board in self.list_my_board]
        
        self.other_user = CustomUser.objects.create_user(
            username="jimmy_carter",
            email="reaper9@dexter.org",
            password="AAAAAAAAAAAAAAAAAAAAAAA" 
        )
        self.other_workspace = Workspace.objects.get(id=self.other_user.id)
        self.other_board = Board.objects.create(name="BBBBBB",background='',workspace=self.other_workspace)
        self.other_boardmembership = BoardMembership.objects.create(user=self.other_user,board=self.other_board)
        # emulate me join other user-board
        self.list_my_board.append(self.other_board)
        self.my_boardmembership.append(BoardMembership.objects.create(user=self.me,board=self.other_board,role=BoardMembership.ROLE.MEMBER))

    def tearDown(self):
        if self.me is not None: self.me.delete()
        if self.my_workspace is not None: self.my_workspace.delete()
        if self.list_my_board is not None: 
            for board in self.list_my_board:board.delete()
        if self.my_boardmembership is not None: 
            for member in self.my_boardmembership:member.delete()
        if self.other_user is not None: self.other_user.delete()
        if self.other_workspace is not None: self.other_workspace.delete()
        if self.other_boardmembership is not None: self.other_boardmembership.delete()

    def test_fail_get_detail_boards(self):
        resp = self.client.get(reverse("board-detail",args=[0xdeadbeef]))
        self.assertEqual(404, resp.status_code)

    def test_success_get_detail_boards(self):
        resp = self.client.get(reverse("board-detail",args=[self.list_my_board[0].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(resp.json()['id'], self.list_my_board[0].id)

    def test_success_delete_board(self):
        resp = self.client.delete(reverse("board-detail",args=[self.list_my_board[0].id]))
        self.assertEqual(204, resp.status_code)
        resp = self.client.get(reverse("board-detail",args=[self.list_my_board[0].id]))
        # print(resp.status_code,resp.content)
        self.assertEqual(404, resp.status_code)
        self.assertEqual(resp.json(), {"detail":"Not found."})

class BoardlistTest(APITestCase):
    url = reverse("board-list")
    def setUp(self):
        hook_init_APITestCase(self)
        tmp_workspacemembership = WorkspaceMembership.objects.get(user=self.me.id)
        self.my_workspace = Workspace.objects.get(id=tmp_workspacemembership.workspace.id)
        
        # emulate user create board 
        self.list_my_board = [Board.objects.create(name=hex(i),background='',workspace=self.my_workspace) for i in range(0x4141,0x4143)]
        # me create broard is should synchronize with BoardMembership ()
        self.my_boardmembership = [BoardMembership.objects.create(user=self.me,board=board,starred=(True if i else False)) for i,board in zip(range(2),self.list_my_board)]
        
        self.other_user = CustomUser.objects.create_user(
            username="jimmy_carter",
            email="reaper9@dexter.org",
            password="AAAAAAAAAAAAAAAAAAAAAAA" 
        )
        tmp_workspacemembership = WorkspaceMembership.objects.get(user=self.other_user.id)
        self.other_workspace = Workspace.objects.get(id=tmp_workspacemembership.workspace.id)
        self.other_board = Board.objects.create(name="BBBBBB",background='',workspace=self.other_workspace)
        self.other_boardmembership = BoardMembership.objects.create(user=self.other_user,board=self.other_board)
        # emulate me join other user-board
        self.list_my_board.append(self.other_board)
        self.my_boardmembership.append(BoardMembership.objects.create(user=self.me,board=self.other_board,role=BoardMembership.ROLE.MEMBER))
        # print(Workspace.objects.values_list())
        # print(Board.objects.values_list())
        # print(BoardMembership.objects.values_list())

    def tearDown(self):
        if self.me is not None: self.me.delete()
        if self.my_workspace is not None: self.my_workspace.delete()
        if self.list_my_board is not None: 
            for board in self.list_my_board:board.delete()
        if self.my_boardmembership is not None: 
            for member in self.my_boardmembership:member.delete()
        if self.other_user is not None: self.other_user.delete()
        if self.other_workspace is not None: self.other_workspace.delete()
        if self.other_boardmembership is not None: self.other_boardmembership.delete()
    
    def test_success_create_board(self):
        data={
            "workspace": self.my_workspace.id,
            "name": "Demo board"
        }
        resp = self.client.post(self.url,data)
        info_new_board = resp.json()
        self.assertEqual(201,resp.status_code)
        self.assertEqual(info_new_board['name'],data['name'])
        data = {'workspace':self.my_workspace.id}
        resp = self.client.get(self.url,data=data)
        # print(resp.content)
        self.assertEqual(len(resp.json()),len(self.list_my_board)-1+1)
    
    def test_fail_create_board(self):
        data={
            "workspace": 0xdeadbeaf,
            "name": "Demo board"
        }
        resp = self.client.post(self.url,data)
        # print(resp.content)
        self.assertEqual(400,resp.status_code)

    def test_success_get_board_list_with_workspace_id(self):
        data = {'workspace':self.my_workspace.id}
        resp = self.client.get(self.url,data=data)
        self.assertEqual(200, resp.status_code)
        # print(self.list_my_board)
        tmp = [{'id': board.id, 'name': board.name, 'background': board.background, 'workspace': board.workspace.id, 'members': board.members.get()} for board in self.list_my_board if board.workspace==self.my_workspace]
        self.assertEqual(len(resp.json()), len(tmp))
        # print(list(resp.json()[0]), "\n",list(tmp[0]))
        self.assertEqual(list(resp.json()[0]), list(tmp[0]))
    
    def test_success_get_board_list_with_startted(self):
        data = {'starred':True}
        resp = self.client.get(self.url,data=data)
        # print(resp.content)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(len(resp.json()), 1)
    
    def test_success_get_board_list_with_recent(self):
        data = {'limit':1,'recent':True}
        resp = self.client.get(self.url,data=data)
        # print(resp.content)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(len(resp.json()), 1)
    
