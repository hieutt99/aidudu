import axios from "axios";

// export const BACKEND_ORIGIN="http://128.0.0.1:8000/"
import { BACKEND_ORIGIN } from "../../../../config";
export const LOGIN_URL = BACKEND_ORIGIN+"api/v1/auth/login";
export const REGISTER_URL = BACKEND_ORIGIN+"api/v1/auth/register";
export const REQUEST_PASSWORD_URL = BACKEND_ORIGIN+"api/v1/auth/forgot-password";

export const ME_URL = BACKEND_ORIGIN+"api/v1/me";

export function login(email, password) {
    const username = email;
    return axios.post(LOGIN_URL, { username, password });
  }
  
  export function register(email, fullname, username, password) {
    let splitted = fullname.split(" ");
    
    let first_name = splitted[0];
  
    let last_name = '';
    if(splitted.length > 1){
      last_name = splitted.slice(1).join(" ").trim();
    }
    return axios.post(REGISTER_URL, { email, first_name, last_name, username, password });
  }
  
  export function requestPassword(email) {
    return axios.post(REQUEST_PASSWORD_URL, { email });
  }
  
  export function getUserByToken() {
    // Authorization head should be fulfilled in interceptor.
  
    return axios.get(ME_URL);
  }
