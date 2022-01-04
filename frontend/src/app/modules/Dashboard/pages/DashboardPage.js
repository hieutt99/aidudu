import React, { Suspense } from 'react';
import { Typography } from '@material-ui/core';
import { ContentRoute, LayoutSplashScreen, useSubheader } from '../../../../_metronic/layout';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MyPage } from '../../../pages/MyPage';
import { ProfileCard } from '../../UserProfile/components/ProfileCard';
import { ProfileOverview } from '../../UserProfile/ProfileOverview';
import AccountInformation from '../../UserProfile/AccountInformation';
import ChangePassword from '../../UserProfile/ChangePassword';
import EmailSettings from '../../UserProfile/EmailSettings';
import PersonaInformation from '../../UserProfile/PersonaInformation';
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