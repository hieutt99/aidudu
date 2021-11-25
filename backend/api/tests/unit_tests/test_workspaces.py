from api.tests.unit_tests.utils import *


class WorkSpacesListTest(APITestCase):
    url = reverse("workspace-list")
    def setUp(self):
        hook_init_APITestCase(self)
        self.other_user = ['kevin bacon','lalaland@john.snow','Tremors']
        self.test_user = CustomUser.objects.create_user(
            username=self.other_user[0],
            email=self.other_user[1],
            password=self.other_user[-1] 
        )
        # print(test_user)
        self.workspace_demo = ['work_space_which_this_user_join',set([2]),"public",None]
        
        self.workspace = Workspace.objects.create(
            name=self.workspace_demo[0],
            visibility = self.workspace_demo[2],
            logo = self.workspace_demo[3]
        )
        # workspace.members.add(test_user)
        self.workspace_membership = WorkspaceMembership.objects.create(workspace=self.workspace, user=self.test_user, role=WorkspaceMembership.ROLE.ADMIN)
        self.list_of_my_workspace = [RowWorkspaceMembership.workspace for RowWorkspaceMembership in WorkspaceMembership.objects.filter(user=self.me)] 
    
    def test_fail_get_workspace(self):
        self.client.force_authenticate(user=None,token=None)
        resp = self.client.get(self.url)
        self.assertEqual(401, resp.status_code)

    def test_success_get_workspace(self):
        resp = self.client.get(self.url)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(len(self.list_of_my_workspace),len(resp.json()))

    def test_success_post_create_workspace(self):
        # test create full config 
        data = {"name":"my diding dong",'visibility':'public',"logo":""}
        resp = self.client.post(self.url,data=data)
        # print(resp.content)
        self.assertEqual(201, resp.status_code)
        self.assertEqual({"id","name","visibility","logo","members"}, set(resp.json()))
        # test create with default config 
        data = {"name":"majahi majaho"}
        resp = self.client.post(self.url,data=data)
        # print(resp.content)
        self.assertEqual(201, resp.status_code)
        self.assertEqual({"id","name","visibility","logo","members"}, set(resp.json()))
         
    def tearDown(self):
        if self.me is not None: self.me.delete()
        if self.test_user is not None: self.test_user.delete()
        if self.workspace is not None: self.workspace.delete()
		
class WorkSpacesDetailTest(APITestCase):
    url = 'api/v1/workspaces/'# reverse('workspace-detail')
    def setUp(self):
        hook_init_APITestCase(self)
        self.other_user = ['kevin bacon','lalaland@john.snow','Tremors']
        self.test_user = CustomUser.objects.create_user(
            username=self.other_user[0],
            email=self.other_user[1],
            password=self.other_user[-1] 
        )
        # print(test_user)
        self.workspace_demo = ['work_space_which_this_user_join',set([2]),"public",None]
        
        self.workspace = Workspace.objects.create(
            name=self.workspace_demo[0],
            visibility = self.workspace_demo[2],
            logo = self.workspace_demo[3]
        )
        # workspace.members.add(test_user)
        self.workspace_membership = WorkspaceMembership.objects.create(workspace=self.workspace, user=self.test_user, role=WorkspaceMembership.ROLE.ADMIN)
        self.list_of_my_workspace = [RowWorkspaceMembership.workspace for RowWorkspaceMembership in WorkspaceMembership.objects.filter(user=self.me)] 
    
    def tearDown(self):
        if self.me is not None: self.me.delete()
        if self.test_user is not None: self.test_user.delete()
        if self.workspace is not None: self.workspace.delete()
	
    def get_success_workspace_via_id(self):
        resp = self.client.get(f'{self.url}/{self.workspace.id}')
        self.assertEqual(200, resp.status_code)
        self.assertEqual({"id","name","visibility","logo","members"},set(resp.json()))

