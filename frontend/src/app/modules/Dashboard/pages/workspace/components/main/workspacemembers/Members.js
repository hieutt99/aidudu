import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";

const buttonStyle = {
    backgroundColor: "#DFE1E6",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    borderRadius : "5px",
    width: "250px",
    height: "40px",
    padding: "0px"
};

const inputFieldStyle = {
    border: "2px solid #ccc",
    borderRadius: "3px"
}

// const memberListStyle = {
//     marginTop: "15px"
// }
const memberRowStyle = {
    marginTop: "15px"
}

function Members(props){

    return (
        <>
        <div className="d-flex flex-column w-75">
            <h2 style={{borderBottom:"2px solid"}}>Workspace members (2)</h2>
            <p>Workspace members can view and join all Workspace boards and create new boards in the Workspace</p>
            <div className="d-flex flex-row justify-content-between">
                <div class="input-group input-group-sm mb-3">
                    <input type="text" placeholder="Filter by name" style={inputFieldStyle}></input>
                </div>
                <button class="btn" type="button" style={buttonStyle}>Invite Workspace members</button>
            </div>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row" style={memberRowStyle}>
                    <div className="d-flex flex-row mr-auto align-items-center">
                        <img src="/media/stock-600x400/img-2.jpg" class="rounded-circle" alt="Cinque Terre" width="50" height="50"></img>
                        <h5 style={{marginLeft:"5px"}}>Khoa Pham</h5>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                        <p style={{margin:"0px"}}><u>On 2 boards</u></p>
                        <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Admin</button>
                        <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Remove</button>
                    </div>
                </div>
                <div className="d-flex flex-row" style={memberRowStyle}>
                    <div className="d-flex flex-row mr-auto align-items-center">
                        <img src="/media/stock-600x400/img-2.jpg" class="rounded-circle" alt="Cinque Terre" width="50" height="50"></img>
                        <h5 style={{marginLeft:"5px"}}>Khoa Pham</h5>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                        <p style={{margin:"0px"}}><u>On 2 boards</u></p>
                        <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Admin</button>
                        <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Remove</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Members