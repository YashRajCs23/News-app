// src/services/authService.js
import http from "./http";
import Cookies from "js-cookie";

const authService = {
  signup: async ({ name, email, password, role }) => {
    const { data } = await http.post("/api/auth/signup", { name, email, password, role });
    Cookies.set("token", data.token, { sameSite: "lax" });
    Cookies.set("role", data.user.role, { sameSite: "lax" });
    Cookies.set(data.user.role, data.token, { sameSite: "lax" });
    return data.user;
  },

  login: async ({ email, password }) => {
    const { data } = await http.post("/api/auth/login", { email, password });
    Cookies.set("token", data.token, { sameSite: "lax" });
    Cookies.set("role", data.user.role, { sameSite: "lax" });
    Cookies.set(data.user.role, data.token, { sameSite: "lax" });
    return data.user;
  },

  me: async () => {
    const { data } = await http.get("/api/auth/me");
    return data.user;
  },

  logout: () => {
    Cookies.remove("token");
    const role = Cookies.get("role");
    if (role) Cookies.remove(role);
    Cookies.remove("role");
  },
};

export default authService;
