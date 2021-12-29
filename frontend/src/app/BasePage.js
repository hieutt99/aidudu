import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { WorkspacePage } from "./modules/Dashboard/pages/workspace/WorkspacePage";

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);
const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
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
        <Route path="/workspaces/:workspaceid" component={WorkspacePage}/>
        <Route path="/workspaces/:workspaceid/boards" component={WorkspacePage}/>
        <Route path="/workspaces/:workspaceid/members" component={WorkspacePage}/>
        {/*<ContentRoute path="/builder" component={BuilderPage} />*/}
        <ContentRoute path="/my-page" component={MyPage} />
        <ContentRoute path="/workspace" component={WorkspacePage} />
        {/*<Route path="/google-material" component={GoogleMaterialPage} />*/}
        {/*<Route path="/react-bootstrap" component={ReactBootstrapPage} />*/}
        {/*<Route path="/e-commerce" component={ECommercePage} />*/}
        <Route path="/user-profile" component={UserProfilepage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
