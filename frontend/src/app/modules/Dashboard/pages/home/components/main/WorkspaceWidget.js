import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Switch, Route, NavLink } from "react-router-dom";
import { getWorkspaceBoards } from "../../../../_redux/home/homeCrud";
import { toast } from 'react-toastify'

export function WorkspaceWidget(props){
    const workspace = props.workspace
    const className = props.className
    const [boards, setBoards] = useState([])
    
    useEffect(() => {
        getWorkspaceBoards(workspace.id)
        .then(res => setBoards(res.data))
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
                <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                        {workspace.name}
                        </span>
                    </h3>
                </div>
                <div className="card-body pt-2 pb-0 mt-n3">
                    <div className="row">
                        {boards.map((board, index)=>
                            <>
                                <div className="col-sm-3">
                                    <div className="card card custom">
                                        <NavLink className="menu-link" to={`boards/${board.id}`} >
                                            <div className="card-body">
                                                <img className="card-img-center" src="..." alt="Card image cap"></img>

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
