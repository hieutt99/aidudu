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
  const [lists, setLists] = useState([]); // lists -> get in Board, pass to CardModal

  const handleOnCardClose = async () => {
    await setRerenderFlag(true);
    history.goBack();
  }

  return (
    <>
      <Route path={`${url}/:boardId`} render={() => {
        return (
          <Board rerenderFlag={rerenderFlag} setRerenderFlag={setRerenderFlag} setLists={setLists}/>
        )
      }} />
      <Route path={`${url}/:boardId/card/:cardId`} children={({ match }) => {
        return (
          match ? <CardModal onClose={handleOnCardClose} open={Boolean(match)} lists={lists}/> : ""
        )
      }} />
      {/*<Redirect to={"/error/error-v1"}/>*/}
    </>
  );
}

export default BoardPage;