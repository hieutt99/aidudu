import axios from "axios";
import { BACKEND_ORIGIN } from "../../../../../config"

export const WORKSPACE_URL = BACKEND_ORIGIN+"api/v1/workspaces";
export const BOARD_URL = BACKEND_ORIGIN+"api/v1/boards";

export function getWorkspaceById(workspaceid) {
    const workspace_id = workspaceid
    console.log(workspaceid)
    let url = WORKSPACE_URL+`/${workspace_id}`
    console.log(url)
    return axios.get(url)
}

export function getMembersByWorkspace(workspaceid){
    const workspace_id = workspaceid
    let url = WORKSPACE_URL+`/${workspace_id}/members`
    console.log(url)
    return axios.get(url)
}