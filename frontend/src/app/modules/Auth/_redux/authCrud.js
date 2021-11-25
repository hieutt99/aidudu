import axios from 'axios';

import { LOGIN_URL, ME_URL, REGISTER_URL, REQUEST_PASSWORD_URL } from '../../../../config';

export function login(email, password) {
  const username = email;
  return axios.post(LOGIN_URL, { username, password });
}

export function register(email, fullname, username, password) {
  let splitted = fullname.split(' ');

  let first_name = splitted[0];

  let last_name = '';
  if (splitted.length > 1) {
    last_name = splitted.slice(1).join(' ').trim();
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