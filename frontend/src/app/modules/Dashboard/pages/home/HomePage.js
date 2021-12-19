import React, { Suspense } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Switch } from 'react-router-dom';
import { HomeAside } from './components/aside/HomeAside';

function HomePage(props) {
    const dispatch = useDispatch()
    const workspaces = useSelector((state) => state.workspaces.workspaces, shallowEqual)

  // TODO: add route

  return (
      <>
      <HomeAside workspaces={workspaces}/>
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