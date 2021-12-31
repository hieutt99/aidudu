import React, { Suspense } from 'react';
import { ContentRoute, LayoutSplashScreen, useSubheader } from '../../../../../_metronic/layout';import { Switch } from 'react-router-dom';

function WorkspacePage(props) {

  //TODO: add route

  return (
      <>
      <h4>Workspace page</h4>
      <Switch>
        {/*{*/}
        {/*  <Redirect*/}
        {/*    exact={true}*/}
        {/*    from="/"*/}
        {/*    to="/"*/}
        {/*  />*/}
        {/*}*/}
        {/*<ContentRoute path="/" component={} />*/}
      </Switch>
      </>
  );
}

export default WorkspacePage;