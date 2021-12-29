import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import {
  DropdownCustomToggler,
  DropdownMenu4,
} from "../../../../../_metronic/_partials/dropdowns";

export function WorkspaceCard(){
    return (
        <>
            {(
                <div
                className="flex-row-auto offcanvas-mobile w-250px w-xxl-350px"
                id="kt_profile_aside"
                >
                <div className="card card-custom card-stretch">
                    {/* begin::Body */}
                    <div className="card-body pt-4">
                    {/* begin::Nav */}
                    <div className="navi navi-bold navi-hover navi-active navi-link-rounded">
                        <div className="navi-item mb-2">
                            <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="workspace1">Workspace 1</button>
                            <div id="workspace1" class="collapse">
                                abc
                            </div>
                        </div>
                        <div className="navi-item mb-2">
                        <NavLink
                            to=""
                            className="navi-link py-4"
                            activeClassName="active"
                        >
                            <span className="navi-icon mr-2">
                            </span>
                            <span className="navi-text font-size-lg">
                            Workspace 2
                            </span>
                        </NavLink>
                        </div>
                        <div className="navi-item mb-2">
                        <NavLink
                            to=""
                            className="navi-link py-4"
                            activeClassName="active"
                        >
                            <span className="navi-icon mr-2">
                                <span className="workspace-img">
                                    <img src="/media/workspace-ava/workspace-ava.png" alt="workspace image" width="24" height="24"></img>
                                </span>
                            </span>
                            <span className="navi-text font-size-lg">
                            Workspace 3
                            </span>
                        </NavLink>
                        </div>
                        <div className="navi-item mb-2">
                        <NavLink
                            to=""
                            className="navi-link py-4"
                            activeClassName="active"
                        >
                            <span className="navi-icon mr-2">
                            </span>
                            <span className="navi-text font-size-lg">
                            Workspace 4
                            </span>
                        </NavLink>
                        </div>
                        <div className="navi-item mb-2">
                        <NavLink
                            to=""
                            className="navi-link py-4"
                            activeClassName="active"
                        >
                            <span className="navi-icon mr-2">
                            </span>
                            <span className="navi-text font-size-lg">
                            Workspace 5
                            </span>
                        </NavLink>
                        </div>
                    
                    </div>
                    {/* end::Nav */}
                    </div>
                    {/* end::Body */}
                </div>
                </div>
            )}
        </>

    );
}