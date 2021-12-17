import {createSlice} from "@reduxjs/toolkit";

const initialHomeState = {
    wp_list: [],
    listLoading: true,
    error: null,
    actionsLoading: true
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const homeSlice = createSlice({
  name: "home",
  initialState: initialHomeState,
  reducers: {
    startCall: (state, action) => {
        state.error = null;
        if (action.payload.callType === callTypes.list) {
          state.listLoading = true;
        } else {
          state.actionsLoading = true;
        }
    },
    workspacesFetched: (state, action) => {
        state.listLoading = false;
        state.error = null;
        state.wp_list = action.payload;
    },
    catchError: (state, action) => {
        state.error = `${action.type}: ${action.payload.error}`;
        if (action.payload.callType === callTypes.list) {
            state.listLoading = false;
        } else {
            state.actionsLoading = false;
        }
    },
  }
});
