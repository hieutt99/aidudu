import * as requestAPI from "./homeCrud";
import {homeSlice, callTypes} from "./productsSlice";

const {actions} = homeSlice;

export const fetchWorkspaces = dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestAPI
    .getUserWorkspace()
    .then(response => {
      const { totalCount, entities } = response.data;
      dispatch(actions.workspacesFetched({ totalCount, entities }));
    })
    .catch(error => {
      error.clientMessage = "Can't find workspaces";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

