import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { WorkspaceWidget } from "./WorkspaceWidget";

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

    return (
        <>
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
                    <h4>Filter by</h4>
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
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">Default</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"></input>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-around">
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                </div>
                <div className="d-flex flex-row justify-content-around">
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                    <img src="/media/stock-600x400/img-4.jpg" class="img-fluid" style={boardBackgroundIMG} alt="Responsive image"></img>
                </div>
            </div>
        </div>
        </>
    )
}

export default WorkspaceBoards