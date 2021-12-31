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
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*begin::1 Level*/}
        <li className="menu-section ">
          <h4 className="menu-text text-white">Workspaces</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {workspaces_array.map(workspace => 
           <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                    `/workspaces/${workspace.id}`,
                    true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
            >
                <NavLink className="menu-link menu-toggle" to={`/workspaces/${workspace.id}`}>
                    <span className="svg-icon menu-icon">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                    </span>
                    <span className="menu-text text-white">{workspace.name}</span>
                    <i className="menu-arrow" />
                </NavLink>
                <div className="menu-submenu ">
                    <i className="menu-arrow" />
                    <ul className="menu-subnav">
                        <li
                            className={`menu-item ${getMenuItemActive(
                                `/workspaces/${workspace.id}/boards`,
                                true
                            )}`}
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={`/workspaces/${workspace.id}/boards`}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                            </span>
                            <span className="menu-text text-white">Boards</span>
                            </NavLink>
                        </li>
                        <li
                            className={`menu-item ${getMenuItemActive(
                                `/workspaces/${workspace.id}/members`,
                                true
                            )}`}
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={`/workspaces/${workspace.id}/members`}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")} />
                            </span>
                            <span className="menu-text text-white">Members</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </li>
        )}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/workspaces",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >

        </li>
        {/*end::1 Level*/}
    </ul>
    </>
    )
}