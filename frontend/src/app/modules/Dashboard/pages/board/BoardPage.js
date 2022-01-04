import React, { useState } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import Board from './components/Board';
import CardModal from '../card/CardModal';

function BoardPage(props) {
  const { url } = useRouteMatch();
  const history = useHistory();
  console.log("boardpage", url);

  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [lists, setLists] = useState([]); // lists -> get in Board, pass to CardModal
  const [members, setMembers] = useState([]) // members -> get in Board, pass to CardModal

  const handleOnCardClose = async () => {
    await setRerenderFlag(true);
    history.goBack();
  }

  return (
    <>
      <Route path={`${url}/:boardId`} render={() => {
        return (
          <Board rerenderFlag={rerenderFlag} setRerenderFlag={setRerenderFlag} setLists={setLists} setMembers={setMembers}/>
        )
      }} />
      <Route path={`${url}/:boardId/card/:cardId`} children={({ match }) => {
        return (
          match ? <CardModal onClose={handleOnCardClose} open={Boolean(match)} lists={lists} members={members}/> : ""
        )
      }} />
      {/*<Redirect to={"/error/error-v1"}/>*/}
    </>
  );
}

export default BoardPage;