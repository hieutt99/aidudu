import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import {getCardOfUser} from "../_redux/ApiCard";

export function ShowCardFromAllBoard(){
	
	const [list_card_sort, setListCardSort] = useState([])
	const [list_card_unsort, setListCardUnsort] = useState([])
	const user = useSelector((state) => state.auth.user, shallowEqual);
	useEffect(()=>{
		getCardOfUser().then(res=>{
			// getCardOfUser(user.id)
			// setWorkspace(res.data)
		}).catch(err=>{
			toast.error('Cannot get workspaces', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true
			  });
		});
		
	}, [])
	
	console.log(list_card)
	return (
		<>
			<div>
				
			</div>
		</>
	);
}