import http from "./httpService";
import jwtDecode from "jwt-decode";
const apiEndpoint = "/api/auth";
const tokenKey = "covid19-token";

//adding covid19-auth-token, if any, to the headers.
//Required to access protected api endpoints.
http.setJwt(getJwt());

export async function login(dni, password) {
  const { data: jwt } = await http.post(apiEndpoint, { dni, password });
  const { token } = jwt;
  localStorage.setItem(tokenKey, token);
}
export async function checkLogin(dni, password) {
  const data = await http.post(apiEndpoint, { dni, password });
  return data;
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt,
  checkLogin
};
