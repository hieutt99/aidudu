import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Redirect, Switch, Route, NavLink, useParams } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";
import WorkspaceDetail from "../mainheader/WorkspaceDetail";
import WorkspaceMemberMain from "./workspacemembers/WorkspaceMemberMain";

const boardBackgroundIMG = {
    width : "350px",
    height : "170px",
    borderRadius : "8px",
    margin: "20px"
}

function WorkspaceMembers(props){
    const {workspaceId} = useParams();
    console.log(workspaceId)
    return (
        <>
        <div className="d-flex flex-column w-100">
            <WorkspaceDetail workspaceId={workspaceId}/>
            <WorkspaceMemberMain workspaceId={workspaceId}/>
        </div>
        </>
    )
}

export default WorkspaceMembers