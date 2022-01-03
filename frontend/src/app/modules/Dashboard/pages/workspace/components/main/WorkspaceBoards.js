import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";
import { useParams } from 'react-router-dom';
import { getWorkspaceBoards } from "../../../../_redux/home/homeCrud";
import { toast } from "react-toastify";
import WorkspaceDetail from "../mainheader/WorkspaceDetail";

const textStyle = {
    fontSize : "15px"
};

const workspaceDetailStyle = {
    backgroundColor : "#afafaf",

};

const workspaceBoardStyle = {
    backgroundColor : "#7FA7CF"
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
}

const boardBackgroundIMG = {
    width : "350px",
    height : "170px",
    borderRadius : "8px",
    margin: "20px"
}

function WorkspaceBoards(props){
    const {workspaceId} = useParams();
    const [boards, setBoards] = useState([])
    const [searchTerm, setSearchTerm] = useState([""])
    const [searchBoards, setSearchBoards] = useState([])
    useEffect(()=>{
        getWorkspaceBoards(workspaceId).then(res=>{
            setBoards(res.data)
            setSearchBoards(res.data)
        }).catch(err=>{
            toast.error('Cannot get boards', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true
              });
        })
    }, [])
    function handleSearchBoard(searchTerm){
        if (searchTerm !==""){
            const searchRes = boards.filter(({name}) => name.includes(searchTerm))
            console.log(searchRes)
            setSearchBoards(searchRes)
        } else if (searchTerm ==""){
            setSearchBoards(boards)
        }
        console.log(searchBoards)
    }


    return (
        <>
        <div className="d-flex flex-column w-100">
            <WorkspaceDetail workspaceId={workspaceId}/>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-around" style={{marginTop:30}}>
                    <div className="d-flex flex-column">
                        <h4>Sort by</h4>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown button
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <h4>Search</h4>
                        <div class="input-group mb-3">
                            <input type="text" onKeyUp={e => {if(e.key==='Enter'){handleSearchBoard(e.target.value)}}} class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                        </div>
                    </div>  
                </div>
                <div className="row">
                    {searchBoards.map(board => 
                        <div className="col-sm-4">
                            <div className="image-container" style={{position:"relative", textAlign:"center",textTransform:"uppercase",fontSize:"30px"}}>
                                <NavLink
                                to={`/boards/${board.id}`}
                                activeClassName="active"
                                >
                                        <img src={board.background}  style={boardBackgroundIMG} alt={board.name}></img>
                                        <div class="top-left" style={{position:"absolute", top:"25px", left:"90px", color:"white"}}>{board.name}</div>
                                </NavLink>
                        </div>
                        </div>

                    )}
                </div>
            </div>
        </div>              
        </>
    )
}

export default WorkspaceBoards