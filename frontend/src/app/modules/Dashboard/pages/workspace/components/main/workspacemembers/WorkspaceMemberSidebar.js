import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";

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
    borderRadius : "5px"
};

const clickedButtonStyle = {
    backgroundColor: "#EEF0F8",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    borderRadius : "5px 5px 0px 0px"
};


function WorkspaceMemberSidebar(props){
    return (
        <>
        <div className="d-flex flex-column" style={{marginRight:"50px"}}>
            <h4>Members of Workspace boards</h4>
            <div className="navi-item" >
                    <NavLink
                        to="/workspace/members/members"
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" style={buttonStyle}>Workspace members (2)</button>
                    </NavLink>
            </div>
            <div className="navi-item">
                    <NavLink
                        to="/workspace/members/guests"
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" style={buttonStyle}>Guest (1)</button>
                    </NavLink>
            </div>
        </div>
        </>
    )
}

export default WorkspaceMemberSidebar