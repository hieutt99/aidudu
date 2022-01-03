import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// import { useSubheader } from "../../../_metronic/layout";
import { SubHeader } from "./components/SubHeader";
// import { SubHeader } from "./components/SubHeader";
// code user profile change  => component 
import AccountInformation from "./AccountInformation";
import { ProfileOverview } from "./ProfileOverview";
import ChangePassword from "./ChangePassword";
import PersonaInformation from "./PersonaInformation";
import EmailSettings from "./EmailSettings";
import { ProfileCard } from "./components/ProfileCard";

export default function UserProfilePage() {
  const subheader = SubHeader({title:"User Profile"});
  
  return (
    <div className="d-flex flex-row">
	  {/*<ProfileCard></ProfileCard>*/}
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Redirect
            from="/user-profile"
            exact={true}
            to="/user-profile/profile-overview"
          />
          
		  
        </Switch>
      </div>
	  
    </div>
  );
}
