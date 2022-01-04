import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../../../../_metronic/_helpers";

export function HomeAsideMenuList({ layoutProps, workspaces, handleWorkspaceModalOpen }) {
    const location = useLocation();
    const [clicked, setClicked] = useState(false)
    const getMenuItemActive = (url, hasSubmenu = false) => {
        return checkIsActive(location, url)
        ? ` ${!hasSubmenu &&
            "menu-item-active"} menu-item-open menu-item-not-hightlighted`
        : "";
    };
    const workspaces_array = workspaces
    // console.log(workspaces_array)
//   useEffect = () => {
//       dispatchEvent()
//   }
    function handleClicked(){
        setClicked(!clicked)
    }


  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")} />
            </span>
            <span className="menu-text text-black">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li className="menu-section ">
            <li className="menu-item">
                <div className="d-flex flex-row justify-content-between">
                    <h4 className="menu-text text-black">Workspaces</h4>
                    <span className="svg-icon" onClick={handleWorkspaceModalOpen} style={{cursor: 'pointer'}}>
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")} />
                    </span>
                </div>
            </li>
            
        </li>
        {workspaces_array.map((workspace, key) =>
        <>
        <li
                className={clicked===true ? `menu-item menu-item-submenu menu-item-open`: `menu-item menu-item-submenu`}
                aria-haspopup="true"
                data-menu-toggle="hover"
                key={key}
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
        </>
           

        )}
        {/*end::1 Level*/}
    </ul>
    </>
    )
}