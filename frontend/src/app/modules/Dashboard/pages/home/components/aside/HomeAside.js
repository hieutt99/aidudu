import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
// import {Brand} from "../brand/Brand";
import {HomeAsideMenu} from "./HomeAsideMenu";
import {useHtmlClassService} from "../../../../../../../_metronic/layout/_core/MetronicLayout";

export function HomeAside({workspaces, handleWorkspaceModalOpen}) {
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
                <HomeAsideMenu disableScroll={layoutProps.disableScroll} workspaces={workspaces} handleWorkspaceModalOpen={handleWorkspaceModalOpen}/>
            </div>
            {/* end::Aside Menu */}
            </div>
            {/* end::Aside */}
        </>
    );
}