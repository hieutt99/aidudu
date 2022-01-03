import axios from "axios";
import { BACKEND_ORIGIN } from "../../../../../config"

export const WORKSPACE_URL = BACKEND_ORIGIN+"api/v1/workspaces";
export const BOARD_URL = BACKEND_ORIGIN+"api/v1/boards";

// CREATE =>  POST: add a new product to the server

export function getUserWorkspace() {
    let url = WORKSPACE_URL
    return axios.get(url)
}

export function getWorkspaceBoards(workspaceid) {
    const workspace_id = workspaceid
    // console.log(workspaceid)
    let url = BOARD_URL+`/?workspace=${workspace_id}`
    console.log(url)
    return axios.get(url)
}
// export function createWorkspace(data) {
//     url = WORKSPACE_URL
//     axios.post(url, data=data).then(res => {
//         return res
//     }).catch(err=>{
//         return err
//     })
// }

// export function createBoard() {

// }



