import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../../../../_metronic/_helpers";
import { WorkspaceMenuItem } from "./WorkspaceMenuItem";

export function HomeAsideMenuList({ layoutProps, workspaces, handleWorkspaceModalOpen }) {
    const location = useLocation();
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
            <WorkspaceMenuItem workspace={workspace} />
        </>
           

        )}
        {/*end::1 Level*/}
    </ul>
    </>
    )
}