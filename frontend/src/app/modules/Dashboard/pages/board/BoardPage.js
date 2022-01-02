import React, { Suspense, useState } from 'react';
import { ContentRoute, LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import MyDashBoard from './components/Board';
import Board from './components/Board';
import CardModal from '../card/CardModal';

function BoardPage(props) {
  const { url } = useRouteMatch();
  const history = useHistory();
  console.log("boardpage", url);

  const [rerenderFlag, setRerenderFlag] = useState(false);

  const handleOnCardClose = async () => {
    await setRerenderFlag(true);
    history.goBack();
  }

  return (
    <>
      <Route path={`${url}/`} render={() => {
        return (
          <Board rerenderFlag={rerenderFlag} setRerenderFlag={setRerenderFlag}/>
        )
      }} />
      <Route path={`${url}/card/:cardId`} children={({ match }) => {
        return (
          match ? <CardModal onClose={handleOnCardClose} open={Boolean(match)}/> : ""
        )
      }} />
      {/*<Redirect to={"/error/error-v1"}/>*/}
    </>
  );
}

export default BoardPage;