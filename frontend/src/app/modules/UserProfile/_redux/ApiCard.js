import axios from "axios";
import { BACKEND_ORIGIN } from "../../../../config"

export const CARD_URL = BACKEND_ORIGIN+"api/v1/cards/";
export const BOARD_URL = BACKEND_ORIGIN+"api/v1/boards/";
export const USER_URL = BACKEND_ORIGIN+"api/v1/users/";

export function getAllBoard(){
	let url = BOARD_URL
	return axios.get(url)
};

export function getBoardDetail(boardId){
	let url = BOARD_URL+`/${boardId}/details/`
	return axios.get(url)
};

export function getCardOfUser(userId){
	let url = USER_URL+`${userId}/cards/`
	return axios.get(url)
};