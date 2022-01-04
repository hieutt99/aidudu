import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState , useEffect, useRef} from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "../main/WorkspaceWidget";
import { toast } from "react-toastify"
import { getWorkspaceById } from '../../../../_redux/workspace/workspaceCrud';
import { getWorkspaceBoards } from "../../../../_redux/home/homeCrud";
import { Popover, Overlay } from 'react-bootstrap';
import { lightGreyBackground, iconSize20, popoverDialogContainer } from '../../../board/components/BoardStyles';
import Axios from "axios";
import { MdClose, MdLockOutline } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { BACKEND_ORIGIN } from '../../../../../../../config';
import { set } from "object-path";
import WorkspaceUpdateModal from "../modal/WorkspaceUpdateModal";

const textStyle = {
    fontSize : "15px",
    textTransform : "capitalize"
};

const workspaceDetailStyle = {
    backgroundColor : "#dddddd",
    borderRadius : "5px"
};


const buttonStyle = {
    backgroundColor: "#EEF0F8",
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


function WorkspaceDetail(workspaceId){
    console.log(workspaceId)
    const [workspace, setWorkspace] = useState([])
    const [button, setButton] = useState([])
    const dialogWorkspaceVisibilityTarget = useRef(null);
    const [openWorkspace, setOpenWorkspace] = useState(false);

    const [isDialogWorkspaceVisibilityOpen, setDialogWorkspaceVisibility] = useState(false);
    const onWorkspaceVisibleButtonClicked = () => {
        if (isDialogWorkspaceVisibilityOpen) {
            setDialogWorkspaceVisibility(false);
        } else {
            setDialogWorkspaceVisibility(true);
        }
    };
    const handleWorkspaceOpen = () => {
        setOpenWorkspace(true);
      };
    
    const handleWorkspaceClose = () => {
    setOpenWorkspace(false);
    };
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
    }, [])

    function changeWorkspaceName(name){
        Axios.put(`${BACKEND_ORIGIN}api/v1/workspaces/${workspace.id}/settings/`, {name: name}).then(res => {
        }).catch(e => {
            alert("Error updating workspace's name!");
        });
    }

    function changeWorkspaceLogo(logourl){
        console.log(logourl)
        Axios.put(`${BACKEND_ORIGIN}api/v1/workspaces/${workspace.id}/settings/`, {logo: logourl}).then(res => {
        }).catch(e => {
            alert("Error updating workspace's logo!");
        });
    }

    console.log(workspace)
    return (
        <>
        <div className="d-flex flex-column">
            <div className="d-flex flex-column" style={workspaceDetailStyle}>
                <div className="d-flex flex-row justify-content-center">
                    <div className="d-flex justify-content-center" style={{width:150, height:150}}>
                        <img src={workspace.logo} class="img-fluid" alt="Responsive image"></img>
                    </div>
                    <div className="d-flex flex-column m-5">
                        <h2>{workspace.name}</h2>
                        <p className="text-left" style={textStyle}> {workspace.visibility} </p>
                        <button type="button" className="btn btn-md"  onClick={handleWorkspaceOpen} style={{color: "black", backgroundColor: "#EC6451"}}>Edit workspace's details</button>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center" style={{marginTop:15}}>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to={`/workspaces/${workspace.id}/boards`}
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" onClick={e=>{setButton(clickedButtonStyle)}} style={buttonStyle}>Boards</button>
                    </NavLink>
                    </div>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to={`/workspaces/${workspace.id}/members`}
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" onClick={e=>{setButton(clickedButtonStyle)}} style={buttonStyle}>Members</button>
                    </NavLink>
                    </div>
                    <div className="navi-item" style={{marginBottom:"0px"}}>
                    <NavLink
                        to={`/workspaces/${workspace.id}/settings`}
                        className="navi-link py-4"
                        activeClassName="active"
                    >
                        <button type="button" className="btn" onClick={e=>{setButton(clickedButtonStyle)}} style={buttonStyle}>Settings</button>
                    </NavLink>
                    </div>
                </div>
            </div>
        </div>
        {/* Edit Workspace Details */}
        <div class="modal fade" id="editWorkspaceDetails" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
              {/*Modal to create workspace*/}
        <WorkspaceUpdateModal workspaceId={workspaceId} openWorkspace={openWorkspace} handleWorkspaceModalClose={handleWorkspaceClose} />
        </div>
        </>
    )
}

export default WorkspaceDetail