import React, { Suspense } from 'react';
import { LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Route, Switch } from 'react-router-dom';
import MyDashBoard from './components/MyDashBoard';

function BoardPage(props) {

  // TODO: add route

  return (
      <Switch>
        <Route path="/" component={MyDashBoard} />
        {/*{*/}
        {/*  <Redirect*/}
        {/*    exact={true}*/}
        {/*    from="/"*/}
        {/*    to="/"*/}
        {/*  />*/}
        {/*}*/}
        {/*<ContentRoute path="/" component={} />*/}
      </Switch>
  );
}

export default BoardPage;