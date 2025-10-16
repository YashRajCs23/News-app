import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import authService from "../services/authService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = Cookies.get("token");
      if (!token) return setUser(null);
      const stored = Cookies.get("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) return setUser(parsed);
        } catch (e) {
        }
      }
      try {
        const me = await authService.me();
        if (me) setUser(me);
      } catch (e) {
        setUser(null);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) {
      Cookies.remove("user");
      Cookies.remove("role");
      return;
    }
    Cookies.set("user", JSON.stringify(user), { sameSite: "lax" });
    Cookies.set("role", user.role || "user", { sameSite: "lax" });
  }, [user]);

  const login = (userData) => {
    Cookies.set("user", JSON.stringify(userData), { sameSite: "lax" });
    Cookies.set("role", userData.role || "user", { sameSite: "lax" });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    const role = Cookies.get("role");
    if (role) Cookies.remove(role);
    Cookies.remove("role");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
