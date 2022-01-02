import React, { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { LayoutSplashScreen } from '../../../../../_metronic/layout';
import { Switch, Route } from 'react-router-dom';
import { HomeAside } from './components/aside/HomeAside';
import { getUserWorkspace } from '../../_redux/home/homeCrud';
import { toast } from "react-toastify"
import HomeMain from './components/main';
// import WorkspacePage from '../workspace/WorkspacePage';
// import WorkspaceBoards from './components/main/WorkspaceBoards';
// import WorkspaceMembers from './components/main/WorkspaceMembers';
// import WorkspaceSettings from './components/main/WorkspaceSettings';
function HomePage(props) {
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
    console.log(workspaces.find(x => x.id == '1'))

  // TODO: add route

  return (
      <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Page*/}
        <div className="d-flex flex-row flex-column-fluid page">
            <HomeAside workspaces={workspaces}/>
            <HomeMain workspaces={workspaces}/>
        </div>
      </div> 
      <Switch>
        {/* <Route
            path="/workspaces/:workspaceId"
            component={WorkspacePage}
        /> */}
        {/* <Route
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
        /> */}
      </Switch>
      </>
  );
}

export default HomePage;