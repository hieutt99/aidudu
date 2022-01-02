import React, { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ContentRoute, LayoutSplashScreen, useSubheader } from '../../../../../_metronic/layout';
import { Redirect, Route, Switch } from "react-router-dom";
import { WorkspaceAside } from './components/aside/WorkspaceAside';
import { getUserWorkspace } from '../../_redux/home/homeCrud';
import { toast } from "react-toastify"
import WorkspaceBoards from './components/main/WorkspaceBoards';
import WorkspaceDetail from './components/mainheader/WorkspaceDetail';
import WorkspaceMembers from './components/main/WorkspaceMembers';
import WorkspaceSettings from './components/main/WorkspaceSettings';
import { useParams } from 'react-router-dom';
import { HomeAside } from '../home/components/aside/HomeAside';

export function WorkspacePage(props) {
  // const workspaces = useSelector((state) => state.workspaces.workspaces, shallowEqual)
  const { workspaceId } = useParams()
  // console.log("=======================")
  console.log(workspaceId)
  const [workspaces, setWorkspace] = useState([])
  const [boards, setBoards] = useState([])
  useEffect(()=>{
    getUserWorkspace().then(res=>{
        setWorkspace(res.data)
    }).catch(err=>{
        toast.error('Cannot get workspaces', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true
          });
    });
    
  }, [])

  return (
    <>
    <div className="d-flex flex-row">
      {/*begin::Page*/}
      <div className="d-flex-fluid">
        <HomeAside workspaces={workspaces}/>
      </div>
      <Switch>
        <Redirect
          from="/workspaces/:workspaceId"
          exact={true}
          to="/workspaces/:workspaceId/boards"
        />
        <Route
          path="/workspaces/:workspaceId/boards"
          component={WorkspaceBoards}
        />
        <Route
          path="/workspaces/:workspaceId/members"
          component={WorkspaceMembers}
        />
        <Route
          path="/workspaces/:workspaceId/settings"
          component={WorkspaceSettings}
        />
      </Switch>
        
    </div>
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

export default WorkspacePage;