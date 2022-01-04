import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export function WorkspaceMenuItem({workspace}) {
    // const workspace=workspace
    console.log(workspace)
    const [clicked, setClicked] = useState(false)
    function handleClicked(){
        setClicked(!clicked)
    }
    return (
        <li
                className={clicked===true ? `menu-item menu-item-submenu menu-item-open`: `menu-item menu-item-submenu`}
                aria-haspopup="true"
                data-menu-toggle="hover"
                key={workspace.id}
                onClick={handleClicked}
            >
                <div className="menu-link menu-toggle ">
                    <span className="svg-icon menu-icon">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                    </span>
                    <span className="menu-text text-black">{workspace.name}</span>
                    <i className="menu-arrow" />
                </div>
                <div className="menu-submenu ">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                        <li
                            className={`menu-item`}
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={`/workspaces/${workspace.id}`}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                                </span>
                                <span className="menu-text text-black">Boards</span>
                            </NavLink>
                        </li>
                        <li
                            className={`menu-item `}
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={`/workspaces/${workspace.id}/members`}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
                            </span>
                            <span className="menu-text text-black">Members</span>
                            </NavLink>
                        </li>
                        <li
                            className={`menu-item `}
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={`/workspaces/${workspace.id}/settings`}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Tools/Tools.svg")} />
                            </span>
                            <span className="menu-text text-black">Settings</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
    )
}