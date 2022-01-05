import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import {getAllBoard,getBoardDetail} from "../_redux/ApiCard"; 

export function SortingByBoard(){
	const user = useSelector((state) => state.auth.user, shallowEqual);
	const [listboard, setListBoard] = useState([])
	useEffect(()=>{
		getAllBoard().then(res=>{
			getBoardDetail
			getCardOfUser(user.id)
			setWorkspace(res.data)
		}).catch(err=>{
			toast.error('Cannot get workspaces', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true
			  });
		});
		
	}, [])
	return (
		<>
			<div>
				
			</div>
		</>
	);
}