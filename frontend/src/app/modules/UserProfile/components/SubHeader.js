/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useLayoutEffect, useEffect} from "react";
import { shallowEqual, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import objectPath from "object-path";
import {useLocation} from "react-router-dom";
import { BACKEND_ORIGIN } from "../../../../config"
import {BreadCrumbs} from "../../../../_metronic/layout/components/subheader/components/BreadCrumbs";
import {getBreadcrumbsAndTitle, useSubheader} from "../../../../_metronic/layout/_core/MetronicSubheader";
import {useHtmlClassService} from "../../../../_metronic/layout/_core/MetronicLayout"

/*
/app/modules/Dashboard/pages/board/components/Boards.js
/app/modules/Dashboard/pages/workspace/components/mainheader/WorkspaceDetail.js
*/

const textStyle = {
    fontSize : "15px",
    textTransform : "capitalize"
};

const subHeaderDetailStyle = {
    backgroundColor : "#afafaf",
};

const buttonStyle = {
    backgroundColor: "#DFE1E6",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    width : "200px",
    height : "40px",
    borderRadius : "5px 5px 0px 0px"
};

const clickedButtonStyle = {
    backgroundColor: "#EEF0F8",
    marginLeft: "3px",
    marginRight: "3px",
    border: "None",
    color: "black",
    width : "100px",
    height : "40px",
    borderRadius : "5px 5px 0px 0px"
};

export function SubHeader(arg) {
	const uiService = useHtmlClassService();
	const location = useLocation();
	const subheader = useSubheader(); // kind of override??
	const user = useSelector(({ auth }) => auth.user, shallowEqual);
	subheader.setTitle(arg.title);

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
		// const breadcrumbs = (aside && aside.breadcrumbs.length > 0) ? header.breadcrumbs : header.breadcrumbs;
		subheader.setBreadcrumbs(breadcrumbs);
		subheader.setTitle((aside && aside.title && aside.title.length > 0) ? aside.title : header.title);
		// subheader.setTitle((aside && aside.title && aside.title.length > 0) ? header.title : header.title);
		// eslint-disable-next-line
	}, [location.pathname]);

	// Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
	useEffect(() => {}, [subheader]);
	// console.log(subheader.breadcrumbs);
	console.log(user);
	// console.log("Message" +"Debug");
	/*
	active page
	*/
	return (
	<>
	<div className="d-flex flex-column">
		<div className="d-flex flex-column" style={subHeaderDetailStyle}>
			{/* begin::User */}
			<div className="d-flex flex-row justify-content-center">
				<div className="d-flex justify-content-center" style={{width:150, height:150}}>
					{/*<div className="img-fluid" style={{ backgroundImage: `url(${user.pic})` }}></div>*/}
					{/*https://stackoverflow.com/questions/32591301/babel-error-jsx-value-should-be-either-an-expression-or-a-quoted-jsx-text*/}
					{/*<img src={`url(${user.pic})`} class="img-fluid" alt={BACKEND_ORIGIN+"media/profile_pics/default.jpg"}></img>*/}
					<img src={user.avatar?BACKEND_ORIGIN+user.avatar.substring(1):BACKEND_ORIGIN+"media/profile_pics/default.jpg"} class="img-fluid" alt=""></img>
				</div>
				<div className="d-flex flex-column m-5">
					<h2 className="text-left" style={{"font-weight":"bold"}}>{user.username}</h2>
					<p className="text-left" style={textStyle}> {user.email} </p>
				</div>
			</div>
			{/* end::User */}
			{/* begin::Nav */}
			<div className="d-flex flex-row navi-active justify-content-center navi-link-rounded" style={{marginTop:15}}>
				<div className="navi-item mb-2" style={{marginBottom:"0px"}}>
					<NavLink
						to="/user-profile/update-user-profile"
						className="navi-link py-8"
						activeClassName="active"
					>
						<button type="button" className="btn" style={buttonStyle}>Update Profile</button>
					</NavLink>
				</div>
				<div className="navi-item" style={{marginBottom:"0px"}}>
					<NavLink
						to="/user-profile/user-cards"
						className="navi-link py-8"
						activeClassName="active"
					>
						<button type="button" className="btn" style={buttonStyle}>Cards</button>
					</NavLink>
				</div>
			</div>
		</div>
		{/* end::Nav */}
	</div>
	</>
	);
}
