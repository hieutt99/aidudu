import React, { Suspense } from 'react';
import { LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Switch } from 'react-router-dom';
import { HomeAside } from './components/aside/HomeAside';

function HomePage(props) {

  // TODO: add route

  return (
      <>
      <HomeAside />
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