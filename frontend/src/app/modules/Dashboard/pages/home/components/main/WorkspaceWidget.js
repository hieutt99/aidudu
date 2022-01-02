import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Switch, Route, NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { getWorkspaceBoards } from "../../../../_redux/home/homeCrud";
import { toast } from 'react-toastify'
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";


export function WorkspaceWidget(props){
    const workspace = props.workspace
    const className = props.className
    const [boards, setBoards] = useState([])
    
    useEffect(() => {
        getWorkspaceBoards(workspace.id)
        .then(res => {
            console.log("+++++++++++++")
            console.log(res.data)
            setBoards(res.data)
        })
        .catch(err => toast.error('Cannot get boards', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true
          }))
    }, [])

    return (
        <>
            <div className={`card card-custom ${className}`}>
            {/* Head */}
                <div className="card-header border-0 pt-5 pb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg">
                                <h3 className="card-title align-items-start flex-column">
                                    <span className="card-label font-weight-bolder text-dark">
                                        {workspace.name}
                                    </span>
                                </h3>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col-sm">
                                        <NavLink className="btn btn-secondary" to={`/workspaces/${workspace.id}/boards`}>
                                            <span className="svg-icon menu-icon">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                                            </span>
                                            <span className="menu-text text-black">Boards</span>
                                        </NavLink>
                                    </div>
                                    <div className="col-sm">
                                        <NavLink className="btn btn-secondary" to={`/workspaces/${workspace.id}/members`}>
                                            <span className="svg-icon menu-icon">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
                                            </span>
                                            <span className="menu-text text-black">Members</span>
                                        </NavLink>
                                    </div>
                                    <div className="col-sm">
                                        <NavLink className="btn btn-secondary" to={`/workspaces/${workspace.id}/settings`}>
                                            <span className="svg-icon menu-icon">
                                                <SVG src={toAbsoluteUrl("/media/svg/icons/Tools/Tools.svg")} />
                                            </span>
                                            <span className="menu-text text-black">Settings</span>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="card-body pt-2 pb-2 mt-n3">
                    <div className="row">
                        {boards.map((board, index)=>
                            <>
                                <div className="col-sm-3">
                                    <div className="card card-custom">
                                        <NavLink className="menu-link" to={`boards/${board.id}`} >
                                            <div className="card-body ">
                                                <img className="card-img-center img-fluid" src={board.background} style={{maxWidth: '100%', height: '20%'}} alt="Card image cap"></img>

                                            </div>
                                        </NavLink>
                                       
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                </div>
                <div className="card-footer border-0 pt-5">

                </div>
            </div>
        </>
    )

}
