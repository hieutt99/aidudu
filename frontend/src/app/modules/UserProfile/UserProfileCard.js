import React, {useMemo, useLayoutEffect, useState, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import objectPath from "object-path";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../Auth";
import {ShowCardFromAllBoard} from  "./components/ShowCardFromAllBoard";
import {SortingByBoard} from  "./components/SortingByBoard";
import {useHtmlClassService} from "../../../_metronic/layout/_core/MetronicLayout"

// import {SortingByBoard} from  "./components/SortingByBoard";

export default function UserProfileCard(){
	// should flip visible data html instead of assign func to state
	// https://stackoverflow.com/questions/24502898/show-or-hide-element-in-react
	const uiService = useHtmlClassService();
	const [modesort, setModeSort] = useState('ShowCardFromAllBoard');
	
	function handleClickSortingByBoard(){
		setModeSort("ShowCardFromAllBoard");
	}

	function handleShowCardFromAllBoard(){
		setModeSort("SortingByBoard");
	}
	
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
	
	useEffect(()=>{
		// getAllBoard()
	})
	
	
	return (
	<>
		<div
			id="kt_bodybutton"
			className={`py-2 py-lg-4 ${layoutProps.subheaderCssClasses}`}
		>
			{/*begin:mode*/}
			<div className="">
				<button 
					className="text-muted font-weight-underline font-size-sm mt-1"
					onClick={handleClickSortingByBoard}
				>
					Sorting by board
				</button>
				
				<button 
					className="text-muted font-weight-underline font-size-sm mt-1"
					onClick={handleShowCardFromAllBoard}
				>
					Showing card from all board
				</button>
			</div>
			{/*end:mode*/}
			{/*begin:body*/}
			<div className=''>
				{modesort==='ShowCardFromAllBoard'?<ShowCardFromAllBoard/>:null }
				{modesort==='SortingByBoard'?<SortingByBoard/>:null }
			</div>
			{/*end:body*/}
		</div>
	</>
	);
}
