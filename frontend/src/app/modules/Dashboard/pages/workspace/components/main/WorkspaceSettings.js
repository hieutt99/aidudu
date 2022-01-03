import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink, useParams } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";
import WorkspaceDetail from "../mainheader/WorkspaceDetail";
import { toast } from "react-toastify"
import { getWorkspaceById } from "../../../../_redux/workspace/workspaceCrud";
// import Popup from "reactjs-popup";

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

function WorkspaceSettings(props){
    const {workspaceId} = useParams();
    const [workspace, setWorkspace] = useState([])
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
    if (workspace.visibility == "private"){
        return (
            <>
            <div className="d-flex flex-column w-100">
                <WorkspaceDetail workspaceId={workspaceId}/>
                <div className="d-flex flex-column justify-content-around" style={{marginTop:"30px", marginLeft:"10px"}}>
                    <h3 style={{borderBottom:"2px solid"}}>Workspace visibility</h3>
                    <div className="d-flex flex-row">
                        <h4 style={{marginRight:"10px", textTransform:"capitalize"}}>{workspace.visibility}</h4>
                        <p style={{margin:"0px"}}>This Workspace is private. It's not indexed or visible to those outside the Workspace</p>
                    </div>
                    <button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", width:"100px", height:"30px", padding:"0px"}} type="button">Change</button>
                    <button class="btn" type="button" style={deleteBtnStyle}>Delete this workspace?</button>
                </div>
            </div>
            </>
        )
    } else {
        return (
            <>
            <div className="d-flex flex-column w-100">
                <WorkspaceDetail workspaceId={workspaceId}/>
                <div className="d-flex flex-column justify-content-around" aria-haspopup='true' style={{marginTop:"30px", marginLeft:"10px"}}>
                    <h3 style={{borderBottom:"2px solid"}}>Workspace visibility</h3>
                    <div className="d-flex flex-row">
                        <h4 style={{marginRight:"10px", textTransform:"capitalize"}}>{workspace.visibility}</h4>
                        <p style={{margin:"0px"}}>This Workspace is public. It's visible to anyone with the link and will show up in search engines like Google. Only those invited to the Workspace can add and edit Workspace boards.</p>
                    </div>
                    {/* <Popup modal trigger={<button class="btn btn-outline-secondary" style={{backgroundColor:"#DFE1E6", width:"100px", height:"50px", padding:"0px"}} type="button">Change</button>}>
                        test
                    </Popup> */}
                    <button class="btn" type="button" style={deleteBtnStyle}>Delete this workspace?</button>
                </div>
            </div>
    
            </>
        )
    }

}

export default WorkspaceSettings