import React, { Suspense } from 'react';
import { ContentRoute, LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import MyDashBoard from './components/Board';
import Board from './components/Board';
import CardModal from '../card/CardModal';

function BoardPage(props) {
  const { url } = useRouteMatch();
  const history = useHistory();
  console.log("boardpage", url);

  return (
    <>
      <Route path={`${url}/`} component={Board} />
      <Route path={`${url}/card/:cardId`} children={({ match }) => {
        return (
          match ? <CardModal onClose={history.goBack} open={Boolean(match)}/> : ""
        )
      }} />
      {/*<Redirect to={"/error/error-v1"}/>*/}
    </>
  );
}

export default BoardPage;