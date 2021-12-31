import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";

function HomeMain(props){
    const wp_list = props.workspaces

    return (
        <>
            <div className="container ">
                {wp_list.map((workspace)=>(
                    <div className="row">
                        <div className="col">
                            <WorkspaceWidget className="gutter-b card-stretch" workspace={workspace} />
                        </div>
                    </div>
                ))
                }
            </div>
        </>
    )
}

export default HomeMain