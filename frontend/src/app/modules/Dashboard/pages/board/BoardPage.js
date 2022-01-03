import React, { Suspense } from 'react';
import { ContentRoute, LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Route, Switch } from 'react-router-dom';
import MyDashBoard from './components/Board';
import Board from './components/Board';

function BoardPage(props) {

  // TODO: add route

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/" component={Board} />
        {/*{*/}
        {/*  <Redirect*/}
        {/*    exact={true}*/}
        {/*    from="/"*/}
        {/*    to="/"*/}
        {/*  />*/}
        {/*}*/}
        {/*<ContentRoute path="/" component={} />*/}
      </Switch>
    </Suspense>
  );
}

export default BoardPage;