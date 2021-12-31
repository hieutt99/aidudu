import React, {useMemo} from "react";
import {WorkspaceAsideMenuList} from "./WorkspaceAsideMenuList";
import {useHtmlClassService} from "../../../../../../../_metronic/layout/_core/MetronicLayout";

export function WorkspaceAsideMenu({disableScroll, workspaces}) {
  const uiService = useHtmlClassService();
  console.log(workspaces)
  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes("aside_menu"),
      ulClasses: uiService.getClasses("aside_menu_nav", true),
      asideClassesFromConfig: uiService.getClasses("aside_menu", true)
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        data-menu-vertical="1"
        className={`aside-menu my-4 ${layoutProps.asideClassesFromConfig}`}
        {...layoutProps.asideMenuAttr}
      >
        <WorkspaceAsideMenuList layoutProps={layoutProps} workspaces={workspaces} />
      </div>
      {/* end::Menu Container */}
    </>
  );
}
