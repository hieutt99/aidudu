import React, { Suspense } from 'react';
import { Typography } from '@material-ui/core';
import { ContentRoute, LayoutSplashScreen, useSubheader } from '../../../../_metronic/layout';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MyPage } from '../../../pages/MyPage';
import { CustomersPage } from '../../ECommerce/pages/customers/CustomersPage';
import { ProductEdit } from '../../ECommerce/pages/products/product-edit/ProductEdit';
import { ProductsPage } from '../../ECommerce/pages/products/ProductsPage';
import BoardPage from './board/BoardPage';
import HomePage from './home/HomePage'
import WorkspacePage from './workspace/WorkspacePage';

//TODO: add routes to inner components
export function DashboardPage() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/" component={HomePage}/>
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