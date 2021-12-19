import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { put, takeLatest, select } from "redux-saga/effects";

import { getUserWorkspace } from "./homeCrud";
import * as auth from "../../../Auth"

export const actionTypes = {
    AddWorkspace: "[AddWorkspace] Action",
    DeleteWorkspace: "[DeleteWorkspace] Action",
    UpdateWorkspace: "[UpdateWorkspace] Action",
    SetWorkspaces: "[SetWorkspaces] Action"
}

const InitialState = {
    workspaces: undefined,
    personalWorkspaces: undefined
}

export const reducer = persistReducer(
    {storage, key: "v1-homepage-workspaces", whitelist=['workspaces', 'personalWorkspaces']},
    (state = InitialState, action) => {
        switch (action.type) {
            case actionTypes.AddWorkspace: {
                const { workspace } = action.payload
                let workspaces = state.workspaces
                workspaces.push(workspace)
                return {workspaces, ...state}
            }
            case actionTypes.DeleteWorkspace: {
                const { workspace } = action.payload
                let workspaces = state.workspaces
                for (let i=0; i<workspaces.length; i++){
                    if (workspaces[i].id ===workspace.id){
                        workspaces.splice(i, 1)
                        break
                    }
                }
                return {workspaces, ...state}
            }
            case actionTypes.SetWorkspaces: {
                const { workspace } = action.payload
                return {...state, workspaces: workspace}
            }
            case actionTypes.setOwnerWorkspace: {
                const { workspace } = action.payload
                return {...state, personalWorkspaces: workspace}
            }
            default:
                return state
        }
    }
)

export const actions = {
    addWorkspace: (workspace) => ({ type: actionTypes.AddWorkspace, payload: {workspace}}),
    deleteWorkspace: (workspace) => ({ type: actionTypes.DeleteWorkspace, payload: {workspace}}),
    setWorkspaces: (workspaces) => ({ type: actionTypes.SetWorkspaces, payload: {workspaces} }),
    UpdateWorkspace: () => ({ type: actionTypes.UpdateWorkspace, payload: {}})
}

export function* saga() {
    yield takeLatest([auth.actionTypes.UserLoaded], function* loadWorkspaces() {
        const {data: workspaces} = yield getUserWorkspace();

        yield put(actions.setWorkspaces(workspaces));
    })

    yield takeLatest(actionTypes.UpdateWorkspace, function* loadWorkspace(){
        const {data: workspaces} = yield getUserWorkspace();

        yield put(actions.setWorkspaces(workspaces));
    });
}