import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Redirect, Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";
import WorkspaceMemberSidebar from "./workspacemembers/WorkspaceMemberSidebar";
import Members from "./workspacemembers/Members";
import Guests from "./workspacemembers/Guests";

const boardBackgroundIMG = {
    width : "350px",
    height : "170px",
    borderRadius : "8px",
    margin: "20px"
}

function WorkspaceMembers(props){

    return (
        <>
            <div className="d-flex flex-row-fluid" style={{marginTop:"30px"}}>
                <WorkspaceMemberSidebar/>
                <Switch>
                <Redirect
                    from="/workspace/members"
                    exact={true}
                    to="/workspace/members/members"
                />
                <Route
                    path="/workspace/members/members"
                    component={Members}
                />
                <Route
                    path="/workspace/members/guests"
                    component={Guests}
                />
                </Switch>
            </div>

        </>
    )
}

export default WorkspaceMembers