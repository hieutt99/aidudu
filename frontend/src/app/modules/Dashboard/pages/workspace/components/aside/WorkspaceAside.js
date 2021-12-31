import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
// import {Brand} from "../brand/Brand";
import {WorkspaceAsideMenu} from "./WorkspaceAsideMenu";
import {useHtmlClassService} from "../../../../../../../_metronic/layout/_core/MetronicLayout";

export function WorkspaceAside(workspaces) {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      disableScroll:
          objectPath.get(uiService.config, "aside.menu.dropdown") === "true" ||
          false,
      asideClassesFromConfig: uiService.getClasses("aside", true),
      disableAsideSelfDisplay:
          objectPath.get(uiService.config, "aside.self.display") === false,
      headerLogo: uiService.getLogo()
    };
  }, [uiService]);

  return (
      <>
        {/* begin::Aside */}
        <div id="kt_aside"
             className={`aside aside-left aside-fixed d-flex flex-column flex-row-auto`}>
          {/* <Brand/> */}

          {/* begin::Aside Menu */}
          <div id="kt_aside_menu_wrapper" className="aside-menu-wrapper flex-column-fluid">
            <WorkspaceAsideMenu disableScroll={layoutProps.disableScroll} workspaces={workspaces}/>
          </div>
          {/* end::Aside Menu */}
        </div>
        {/* end::Aside */}
      </>
  );
}