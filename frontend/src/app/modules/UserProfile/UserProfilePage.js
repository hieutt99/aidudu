import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// import { useSubheader } from "../../../_metronic/layout";
import { SubHeader } from "./components/SubHeader";
// import { SubHeader } from "./components/SubHeader";
// code user profile change  => component 
// import AccountInformation from "./AccountInformation";
// import { ProfileOverview } from "./ProfileOverview";
// import ChangePassword from "./ChangePassword";
// import PersonaInformation from "./PersonaInformation";
// import EmailSettings from "./EmailSettings";
import UserProfileUpdate from "./UserProfileUpdate";
import UserProfileCard from "./UserProfileCard";
import { ProfileCard } from "./components/ProfileCard";

export default function UserProfilePage() {
	return (
		<div className="d-flex flex-row">
			<div className="d-flex flex-column w-100">
				<SubHeader arg={''}/>
				<div>
					<Switch>
						{/*default page*/}
						<Redirect
							from="/user-profile"
							exact={true} 
							to="/user-profile/update-user-profile"
						/>
						<Route
							path="/user-profile/update-user-profile"
							component={UserProfileUpdate}
						/>
						<Route
							path="/user-profile/user-cards"
							component={UserProfileCard}
						/>
					</Switch>
				</div>	  
			</div>
		</div>
	);
}
