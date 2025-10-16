import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const http = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const role = Cookies.get("role");
  const token = Cookies.get(role || "token");
  const bearer = Cookies.get("token");
  const useToken = bearer || token;
  if (useToken) config.headers.Authorization = `Bearer ${useToken}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default http;


