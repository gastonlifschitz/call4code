import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../config.json";

const { NODE_ENV, PUBLIC_URL } = process.env;

axios.defaults.baseURL =
  NODE_ENV === "production" ? baseURL : "http://localhost:3000";

if (PUBLIC_URL) axios.defaults.baseURL = PUBLIC_URL;

console.log("baseURL", axios.defaults.baseURL);

axios.defaults.headers.common["Cache-Control"] = "no-cache";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("unexpected: ", error);
    // const { data } = error.response;
    // const msg = { data } ? data : error.response;
    // toast.error(`⚠️ ${msg}`);
    return Promise.reject(error);
  }
  console.log(error.response);
  toast.error(`⚠️ ${error.response.data}`);
  return Promise.reject(error);
});

function setJwt(jwt) {
  if (jwt) axios.defaults.headers.common["covid19-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
