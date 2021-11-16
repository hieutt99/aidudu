import { BACKEND_ORIGIN } from "../app/modules/Auth/_redux/authCrud";
import { actions } from "../app/modules/Auth/_redux/authRedux";

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {

      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    err => {
      Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      // Return any error which is not due to authentication back to the calling service
      if (!err.response || err.response.status !== 401) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }

      // Logout user if token refresh didn't work or user is disabled
      if (
        err.config.url == `${BACKEND_ORIGIN}/api/v1/auth/refresh` ||
        err.response.message == "Account is disabled."
      ) {
        store.dispatch(actions.logout());
        window.location.href = "/auth/login";

        return new Promise((resolve, reject) => {
          reject(err);
        });
      }

      if(err.config.url === `${BACKEND_ORIGIN}/api/v1/auth/login`){
        // User send wrong password or username
        return new Promise((resolve, reject) => {
          resolve(err);
        })
      }

      // Try request again with new token
      const originalReq = err.config;
      if (!err.config || err.config._retry) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }

      const {
        auth: { authToken, refreshToken }
      } = store.getState();
      originalReq._retry = true;

      return axios
        .post(`${BACKEND_ORIGIN}/api/v1/auth/refresh`, {
          refresh: refreshToken
        })
        .then(res => {
          store.dispatch(actions.refreshToken(res.data.access));
          originalReq.headers.Authorization = `Bearer ${res.data.access}`;
          return axios(originalReq);
        })
        .catch(err => {
          store.dispatch(actions.logout());
          window.location.href = "/auth/login";
          return new Promise((resolve, reject) => reject(err));
        });
    }
  );
}
