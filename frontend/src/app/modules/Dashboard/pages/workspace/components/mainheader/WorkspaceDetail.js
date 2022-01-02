import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "../main/WorkspaceWidget";

const textStyle = {
    fontSize : "15px"
};

const workspaceDetailStyle = {
    backgroundColor : "#afafaf",

};


const buttonStyle = {
    backgroundColor: "#DFE1E6",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    width : "100px",
    height : "40px",
    borderRadius : "5px 5px 0px 0px"
};

const clickedButtonStyle = {
    backgroundColor: "#EEF0F8",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    width : "100px",
    height : "40px",
    borderRadius : "5px 5px 0px 0px"
};


function WorkspaceDetail(props){
    return (
        <>
        <div className="d-flex flex-column">
            <div className="d-flex flex-column" style={workspaceDetailStyle}>
                <div className="d-flex flex-row justify-content-center">
                    <div className="d-flex justify-content-center" style={{width:150, height:150}}>
                        <img src="/media/workspace-ava/workspace-ava.png" class="img-fluid" alt="Responsive image"></img>
                    </div>
                    <div className="d-flex flex-column m-5">
                        <h2>Workspace Name</h2>
                        <p className="text-left" style={textStyle}> Private </p>
                        <button type="button" className="btn btn-md" style={{color: "black", backgroundColor: "#EC6451"}}>Edit workspace's details</button>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center" style={{marginTop:15}}>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to="/workspace/boards"
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" style={buttonStyle}>Boards</button>
                    </NavLink>
                    </div>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to="/workspace/members"
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" style={buttonStyle}  >Members</button>
                    </NavLink>
                    </div>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to="/workspace/settings"
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" style={buttonStyle}>Settings</button>
                    </NavLink>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default WorkspaceDetail