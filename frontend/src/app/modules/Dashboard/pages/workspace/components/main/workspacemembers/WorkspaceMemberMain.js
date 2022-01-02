import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { getMembersByWorkspace, getWorkspaceById } from "../../../../../_redux/workspace/workspaceCrud";
import { toast } from "react-toastify"

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
    borderRadius : "5px",
    width: "250px",
    height: "40px",
    padding: "0px"
};

const inputFieldStyle = {
    border: "2px solid #ccc",
    borderRadius: "3px"
}

const memberRowStyle = {
    marginTop: "15px"
}

const clickedButtonStyle = {
    backgroundColor: "#EEF0F8",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    borderRadius : "5px 5px 0px 0px"
};


function WorkspaceMemberMain(workspaceId){
    const [workspace, setWorkspace] = useState([])
    const [members, setMembers] = useState([])
    useEffect(()=>{
        getWorkspaceById(workspaceId.workspaceId).then(res=>{
          setWorkspace(res.data)
        }).catch(err=>{
          toast.error('Cannot get workspace', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true
            });
        })
        getMembersByWorkspace(workspaceId.workspaceId).then(res=>{
            setMembers(res.data)
        }).catch(err=>{
            toast.error('Cannot get members', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true
              });
          })
    }, [])
    console.log(members)
    return (
        <>
        <div className="d-flex flex-row-fluid" style={{marginTop:"30px"}}>
            <div className="d-flex flex-column" style={{marginRight:"50px"}}>
                <h4>Members of Workspace boards</h4>
                <div className="navi-item" >
                        <NavLink
                            to="/workspace/members/members"
                            className="navi-link py-4"
                            activeClassName="active"
                        >
                            <button type="button" className="btn" style={buttonStyle}>Workspace members ({members.length})</button>
                        </NavLink>
                </div>
            </div>
            <div className="d-flex flex-column w-75">
            <h2 style={{borderBottom:"2px solid"}}>Workspace members ({members.length})</h2>
            <p>Workspace members can view and join all Workspace boards and create new boards in the Workspace</p>
            <div className="d-flex flex-row justify-content-between">
                <div class="input-group input-group-sm mb-3">
                    <input type="text" placeholder="Filter by name" style={inputFieldStyle}></input>
                </div>
                <button class="btn" type="button" style={buttonStyle}>Invite Workspace members</button>
            </div>
            <div className="d-flex flex-column">
                {
                    members.map(member =>
                        <div className="d-flex flex-row" style={memberRowStyle}>
                            <div className="d-flex flex-row mr-auto align-items-center">
                                <img src={member.avatar} class="rounded-circle" alt="Cinque Terre" width="50" height="50"></img>
                                <h5 style={{marginLeft:"5px"}}>{member.fullname}</h5>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Admin</button>
                                <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", margin:"5px"}} type="button">Remove</button>
                            </div>
                        </div>
                        )
                }
            </div>
        </div>
        </div>
        </>
    )
}

export default WorkspaceMemberMain