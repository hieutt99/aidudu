import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Switch, Route, NavLink, useParams } from "react-router-dom";
import WorkspaceDetail from "../mainheader/WorkspaceDetail";
import { toast } from "react-toastify"
import { getWorkspaceById } from "../../../../_redux/workspace/workspaceCrud";
import { lightGreyBackground, iconSize20, popoverDialogContainer } from '../../../board/components/BoardStyles';
import { Popover, Overlay } from 'react-bootstrap';
import { MdClose, MdLockOutline } from "react-icons/md";
import { BiWorld } from "react-icons/bi";

import { BACKEND_ORIGIN } from '../../../../../../../config';


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
    height: "30px",
    padding: "0px"
}

const settingModalStyle = {
    
}

function WorkspaceSettings(props){
    const {workspaceId} = useParams();
    const [workspace, setWorkspace] = useState([])
    const [visibility, setVisibility] = useState([""])
    const dialogWorkspaceVisibilityTarget = useRef(null);
    const [isDialogWorkspaceVisibilityOpen, setDialogWorkspaceVisibility] = useState(false);
    const onWorkspaceVisibleButtonClicked = () => {
        if (isDialogWorkspaceVisibilityOpen) {
            setDialogWorkspaceVisibility(false);
        } else {
            setDialogWorkspaceVisibility(true);
        }
    };
    useEffect(()=>{
        getWorkspaceById(workspaceId).then(res=>{
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
    return (
        <>
        <div className="d-flex flex-column w-100">
            <WorkspaceDetail workspaceId={workspaceId}/>
            <div className="d-flex flex-column justify-content-around" style={{marginTop:"30px", marginLeft:"10px"}}>
                <h3 style={{borderBottom:"2px solid"}}>Workspace visibility</h3>
                <div className="d-flex flex-row">
                    <h4 style={{marginRight:"10px", textTransform:"capitalize"}}>{workspace.visibility}</h4>
                    <p style={{margin:"0px"}}>This Workspace is private. It's not indexed or visible to those outside the Workspace.</p>
                </div>
                <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", width:"150px", height:"50px", padding:"0px"}} 
                ref={dialogWorkspaceVisibilityTarget} onClick={onWorkspaceVisibleButtonClicked} type="button">
                    Change
                </button>
                <Overlay target={dialogWorkspaceVisibilityTarget.current} show={isDialogWorkspaceVisibilityOpen} placement="bottom">
                    {(props) => (
                        <Popover {...props}>
                            <div className='rounded bg-white p-0 d-flex flex-column' style={popoverDialogContainer} >

                                {/* Header */}
                                <div className='d-flex justify-content-between align-items-center p-3'>
                                    <div className='btn p-0' onClick={() => { setDialogWorkspaceVisibility(false) }}>
                                        <MdClose style={iconSize20} />
                                    </div>
                                    <h6 className='m-0'>Workspace visibility</h6>
                                    <div className='btn p-0' onClick={() => { setDialogWorkspaceVisibility(false) }}>
                                        <MdClose style={iconSize20} />
                                    </div>
                                </div>

                                <hr className='m-0' />

                                {/* Private */}
                                <div className='d-flex p-3'>
                                    <div>
                                        <MdLockOutline style={iconSize20} />
                                    </div>
                                    <div className='d-flex flex-column mx-3'>
                                        <a onClick={(e)=>{setVisibility("private")}}>
                                            <h6 className='m-0'><strong>Private</strong></h6>
                                            <p className='m-0'>Only board member can see and edit this board.</p>   
                                        </a>
                                    </div>
                                </div>

                                {/* Public */}
                                <div className='d-flex p-3'>
                                    <div>
                                        <BiWorld style={iconSize20} />
                                    </div>
                                    <div className='d-flex flex-column mx-3'>
                                        <a onClick={(e)=>{setVisibility("public")}}>
                                            <h6 className='m-0'><strong>Public</strong></h6>
                                            <p className='m-0'>Anyone on the internet can see this board. Only board members can edit.</p>
                                        </a>
                                    </div>
                                </div>


                            </div>
                </Popover>
            )}
        </Overlay>
                <button class="btn" type="button" style={deleteBtnStyle}>Delete this workspace?</button>
            </div>
        </div>
        </>
    )

}

export default WorkspaceSettings