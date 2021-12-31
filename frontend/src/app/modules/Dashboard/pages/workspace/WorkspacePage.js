import React, { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { LayoutSplashScreen, useSubheader } from '../../../../../_metronic/layout';
import { Redirect, Route, Switch } from "react-router-dom";
import { WorkspaceAside } from './components/aside/WorkspaceAside';
import { getUserWorkspace } from '../../_redux/home/homeCrud';
import { toast } from "react-toastify"
import WorkspaceBoards from './components/main/WorkspaceBoards';
import WorkspaceDetail from './components/mainheader/WorkspaceDetail';
import WorkspaceMembers from './components/main/WorkspaceMembers';
import WorkspaceSettings from './components/main/WorkspaceSettings';

export function WorkspacePage(props) {
  const dispatch = useDispatch()
  // const workspaces = useSelector((state) => state.workspaces.workspaces, shallowEqual)
  const [workspaces, setWorkspace] = useState([])

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
      })
  }, [])
  //TODO: add route

  return (
    <>
    <div className="d-flex flex-row-fluid align-self-stretch">
      {/*begin::Page*/}
      <div className="d-flex-fluid">
        <WorkspaceAside workspaces={workspaces}/>
      </div>
      <div className="d-flex flex-column w-100">
        <WorkspaceDetail workspaces={workspaces}/>
        <Switch>
          <Redirect
            from="/workspace"
            exact={true}
            to="/workspace/boards"
          />
          <Route
            path="/workspace/boards"
            component={WorkspaceBoards}
          />
          <Route
            path="/workspace/members"
            component={WorkspaceMembers}
          />
          <Route
            path="/workspace/settings"
            component={WorkspaceSettings}
          />
        </Switch>
        
      </div>
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