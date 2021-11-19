from api.tests.unit_tests.utils import *


class WorkSpacesTest(APITestCase):
    url = reverse("workspace-list")
    def setUp(self):
        hook_init_APITestCase(self)
        self.other_user = ['kevin bacon','lalaland@john.snow','Tremors']
        test_user = CustomUser.objects.create_user(
            username=self.other_user[0],
            email=self.other_user[1],
            password=self.other_user[-1] 
        )
        # print(test_user)
        self.workspace_demo = ['work_space_which_this_user_join',set([2]),"public",None]
        
        workspace = Workspace.objects.create(
            name=self.workspace_demo[0],
            visibility = self.workspace_demo[2],
            logo = self.workspace_demo[3]
        )
        # workspace.members.add(test_user)
        WorkspaceMembership.objects.create(workspace=workspace, user=test_user, role=WorkspaceMembership.ROLE.ADMIN)
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
        data = {"":""}
        resp = self.client.post(self.url)
        self.assertEqual(200, resp.status_code)

    
