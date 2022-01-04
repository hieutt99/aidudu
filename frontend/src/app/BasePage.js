import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from './modules/Dashboard/pages/DashboardPage';
import WorkspacePage from "./modules/Dashboard/pages/workspace/WorkspacePage";
import Board from "./modules/Dashboard/pages/board/components/Board";
import WorkspaceBoards from "./modules/Dashboard/pages/workspace/components/main/WorkspaceBoards";
import Members from "./modules/Dashboard/pages/workspace/components/main/workspacemembers/Members";
import WorkspaceSettings from "./modules/Dashboard/pages/workspace/components/main/WorkspaceSettings";
import WorkspaceMembers from "./modules/Dashboard/pages/workspace/components/main/WorkspaceMembers";
import BoardPage from "./modules/Dashboard/pages/board/BoardPage";
import UserProfilePage from "./modules/UserProfile/UserProfilePage";
// import { DashboardPage } from "./modules/Dashboard/pages/DashboardPage";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

//TODO: add routes
export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <Route path="/board" component={BoardPage} />
        <Route path="/workspaces/:workspaceId" component={WorkspacePage}/>
        <Route path="/workspaces/:workspaceId/boards" component={WorkspaceBoards}/>
        <Route path="/workspaces/:workspaceId/members" component={WorkspaceMembers}/>
        <Route path="/workspaces/:workspaceId/settings" component={WorkspaceSettings}/>
        <Route path="/user-profile" component={UserProfilePage} />
        <Route
                    path="/workspace/:workspaceId/members/members"
                    component={Members}
                />

        {/*<ContentRoute path="/builder" component={BuilderPage} />*/}
        <ContentRoute path="/my-page" component={MyPage} />
        <ContentRoute path="/workspace" component={WorkspacePage} />
        {/*<Route path="/google-material" component={GoogleMaterialPage} />*/}
        {/*<Route path="/react-bootstrap" component={ReactBootstrapPage} />*/}
        {/*<Route path="/e-commerce" component={ECommercePage} />*/}
        <Route path="/user-profile" component={UserProfilepage} />
        <Redirect to="/error/error-v1" />
        {/*<Route path="*" component={ErrorPage1}/>*/}
      </Switch>
    </Suspense>
  );
}
