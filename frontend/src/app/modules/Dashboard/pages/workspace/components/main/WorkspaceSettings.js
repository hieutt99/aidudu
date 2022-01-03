import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";

const boardBackgroundIMG = {
    width : "350px",
    height : "170px",
    borderRadius : "8px",
    margin: "20px"
}

const deleteBtnStyle = {
    backgroundColor: "#FF5050",
    marginLeft: "3px",
    marginRight: "3px",
    marginTop: "10px",
    border: "None",
    color: "white",
    borderRadius : "5px",
    width: "170px",
    height: "20px",
    padding: "0px"
}

function WorkspaceSettings(props){

    return (
        <>
         <div className="d-flex flex-column justify-content-around" style={{marginTop:"50px"}}>
            <h3 style={{borderBottom:"2px solid"}}>Workspace visibility</h3>
            <div className="d-flex flex-row">
                <h4 style={{marginRight:"10px"}}>Private</h4>
                <p style={{margin:"0px"}}>This Workspace is private. It's not indexed or visible to those outside the Workspace</p>
            </div>
            <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", width:"100px", height:"30px", padding:"0px"}} type="button">Change</button>
            <button class="btn" type="button" style={deleteBtnStyle}>Delete this workspace?</button>
        </div>

        </>
    )
}

export default WorkspaceSettings