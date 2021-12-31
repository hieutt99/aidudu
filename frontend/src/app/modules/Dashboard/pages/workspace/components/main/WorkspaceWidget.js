import React from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState } from "react";
import { Switch, Route, NavLink } from "react-router-dom";

export function WorkspaceWidget(props){
    const workspace = props.workspace
    const className = props.className

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
                    <div id = "myTabTables6" className = "tab-content mt-5">
                        <div id = "kt_tab_pane_6_3" className = "tab-pane fade show active">
                            <div className="table-responsive">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
