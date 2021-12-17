import React, { Suspense } from 'react';
import { LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Switch } from 'react-router-dom';
import { HomeAsideMenu } from './components/aside/HomeAsideMenu';

function HomePage(props) {

  // TODO: add route

  return (
      <>
      <HomeAsideMenu />
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

export default HomePage;