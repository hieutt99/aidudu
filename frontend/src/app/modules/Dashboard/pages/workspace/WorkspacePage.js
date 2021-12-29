import React, { Suspense } from 'react';
import { LayoutSplashScreen, useSubheader } from '../../../../../_metronic/layout';
import { WorkspaceCard } from './WorkspaceCard';
import { Redirect, Route, Switch } from "react-router-dom";
import { WorkspaceBoard } from './WorkspaceBoard';


export function WorkspacePage() {
  const subheader = useSubheader();
  subheader.setTitle("Workspace");
  //TODO: add route

  return (
    <div className="d-flex flex-row">
      <WorkspaceCard></WorkspaceCard>
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
        <Redirect
            from="/workspace"
            exact={true}
            to="/workspace/board"
        />
        <Route
            path="/workspace/board"
            component={WorkspaceBoard}
        />
        </Switch>
      </div>
    </div>
  );
}

export default WorkspacePage;