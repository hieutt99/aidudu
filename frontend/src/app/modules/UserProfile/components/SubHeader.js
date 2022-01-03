/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useLayoutEffect, useEffect} from "react";
import { shallowEqual, useSelector } from "react-redux";
import objectPath from "object-path";
import {useLocation} from "react-router-dom";
import {BreadCrumbs} from "../../../../_metronic/layout/components/subheader/components/BreadCrumbs";
import {getBreadcrumbsAndTitle, useSubheader} from "../../../../_metronic/layout/_core/MetronicSubheader";
import {useHtmlClassService} from "../../../../_metronic/layout/_core/MetronicLayout"


export function SubHeader({title}) {
  const uiService = useHtmlClassService();
  const location = useLocation();
  const subheader = useSubheader(); // kind of override??
  const user = useSelector(({ auth }) => auth.user, shallowEqual);
  subheader.setTitle(title);
  
  const layoutProps = useMemo(() => {
    return {
      config: uiService.config,
      subheaderMobileToggle: objectPath.get(
          uiService.config,
          "subheader.mobile-toggle"
      ),
      subheaderCssClasses: uiService.getClasses("subheader", true),
      subheaderContainerCssClasses: uiService.getClasses(
          "subheader_container",
          true
      )
    };
  }, [uiService]);

  useLayoutEffect(() => {
    const aside = getBreadcrumbsAndTitle("kt_aside_menu", location.pathname);
    const header = getBreadcrumbsAndTitle("kt_header_menu", location.pathname);
    const breadcrumbs = (aside && aside.breadcrumbs.length > 0) ? aside.breadcrumbs : header.breadcrumbs;
    subheader.setBreadcrumbs(breadcrumbs);
    subheader.setTitle((aside && aside.title && aside.title.length > 0) ? aside.title : header.title);
    // eslint-disable-next-line
  }, [location.pathname]);

  // Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
  useEffect(() => {}, [subheader]);
  // console.log(subheader.breadcrumbs);
  console.log(user);
  // console.log("Message" +"Debug");
  return (
	<>
		<div>
		  <a
			href="#"
			className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
		  >
			<>
				{user.username}
			</>
		  </a>
		  <div className="text-muted">{user.email}</div>
		  <div className="mt-2">
		  </div>
		</div>
		
		<div>
		  <a
			href="#"
			className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
		  >
			<>
				{user.username}
			</>
		  </a>
		  <div className="text-muted">{user.email}</div>
		  <div className="mt-2">
		  </div>
		</div>
		
		<div
		  id="kt_subheader"
		  className={`subheader py-2 py-lg-4   ${layoutProps.subheaderCssClasses}`}
		>
			<div
				className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}
			>
			  {/* Info */}
			  <div className="d-flex align-items-center flex-wrap mr-1">
				{layoutProps.subheaderMobileToggle && (
					<button
						className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
						id="kt_subheader_mobile_toggle"
					>
					  <span/>
					</button>
				)}

				<div className="d-flex align-items-baseline mr-5">
				  <h5 className="text-dark font-weight-bold my-2 mr-5">
					<>
					  {subheader.title}
					</>
				  </h5>
					<div>
					  <a
						href="#"
						className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
					  >
						<>
							{user.username}
						</>
					  </a>
					  <div className="text-muted">{user.email}</div>
					  <div className="mt-2">
					  </div>
					</div>
				</div>
				
				<div className="d-flex align-items-baseline mr-5">
				  <h5 className="text-dark font-weight-bold my-2 mr-5">
					<>
					  {subheader.title}
					</>
				  </h5>
				</div>
				
				{/* begin::User */}
				{
				<div className="d-flex align-items-center">
					<div className="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center">
					  <div
						className="symbol-label"
						style={{ backgroundImage: `url(${user.pic})` }}
					  ></div>
					  {/* style="background-i
					  mage:url('/metronic/theme/html/demo1/dist/assets/media/users/300_21.jpg')" */}
					  <i className="symbol-badge bg-success"></i>
					</div>
					<div>
					  <a
						href="#"
						className="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary"
					  >
						<>
							{user.username}
						</>
					  </a>
					  <div className="text-muted">{user.occupation}</div>
					  <div className="mt-2">
					  </div>
					</div>
				</div>
				}
				{/* end::User */}
				<BreadCrumbs items={subheader.breadcrumbs} />
			  </div>
			  
			  {/* TODO: Sub header Toolbar */}
			  {/* Toolbar */}
			  {/*<div className="d-flex align-items-center">*/}
			  {/*  <a href="#" className="btn btn-light btn-sm font-weight-bold" id="kt_dashboard_daterangepicker"*/}
			  {/*     data-toggle="tooltip" title="Select dashboard daterange" data-placement="left">*/}
			  {/*    <span className="text-muted font-weight-bold mr-2" id="kt_dashboard_daterangepicker_title">Today</span>*/}
			  {/*    <span className="text-primary font-weight-bold" id="kt_dashboard_daterangepicker_date">Aug 16</span>*/}
			  {/*  </a>*/}
			  {/*  <QuickActions/>*/}
			  {/*</div>*/}
			</div>
		</div>
	</>
  );
}
