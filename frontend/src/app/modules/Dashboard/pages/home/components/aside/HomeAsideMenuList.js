import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../../../../_metronic/_helpers";

export function HomeAsideMenuList({ layoutProps, workspaces }) {
    const location = useLocation();
    const getMenuItemActive = (url, hasSubmenu = false) => {
        return checkIsActive(location, url)
        ? ` ${!hasSubmenu &&
            "menu-item-active"} menu-item-open menu-item-not-hightlighted`
        : "";
    };
    const workspaces_array = workspaces.workspaces
    console.log(workspaces_array)
//   useEffect = () => {
//       dispatchEvent()
//   }

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
          <h4 className="menu-text text-black">Workspaces</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {workspaces_array.map((workspace, key) =>
           <li
                className={`menu-item menu-item-submenu`}
                aria-haspopup="true"
                data-menu-toggle="hover"
                key={key}
            >
                <div className="menu-link menu-toggle">
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
                            className={`menu-item `}
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
        )}
        {/*end::1 Level*/}
    </ul>
    </>
    )
}