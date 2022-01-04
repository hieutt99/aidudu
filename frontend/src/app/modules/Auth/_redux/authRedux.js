import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken, updateUserApi } from "./authCrud";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
  SetStatusLoading: "[Set Status Loading] Action",
  UpdateUser: "[Update User] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  statusLoading: {
    updateUser: 'idle',
  }
};

export const reducer = persistReducer(
  { storage, key: "v713-demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialAuthState, action) => {

    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;
        
        return { ...state, authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { ...state, authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return { ...state, user: {...user} };
      }

      case actionTypes.SetUser: {
        const { user } = action.payload;

        return {...state, user: {...user} };
      }
      
      case actionTypes.SetStatusLoading: {
        const { key, status } = action.payload;
        const newStatusLoading = {
          ...state.statusLoading,
          [key]: status,
        }
        
        return {...state, statusLoading: newStatusLoading};
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user },
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
  setStatusLoading: (key, status) => ({ type: actionTypes.SetStatusLoading, payload: {key, status}}),
  updateUser: (userChanges, userId) => ({ type: actionTypes.UpdateUser, payload: {userChanges, userId}}),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const user = yield getUserByToken(); //side effect
    yield put(actions.fulfillUser(user.data));  // return action object which is going to be dispatched to reducer
  });
  
  yield takeLatest(actionTypes.UpdateUser, function* updateUserSaga(action) {
    const { userChanges, userId } = action.payload || {};
    
    yield put(actions.setStatusLoading('updateUser', 'loading'));
    const responseUpdateUser = yield updateUserApi(userChanges, userId);
    
    if (responseUpdateUser.status === "SUCCESS") {
      yield put(actions.setStatusLoading('updateUser', 'success'));
      yield put(actions.setUser(responseUpdateUser.data));
    } else if (responseUpdateUser.status === "ERROR") {
      yield put(actions.setStatusLoading('updateUser', 'error'));
    }
    
  })
}
