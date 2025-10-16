// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const guestUser = { name: "Guest User", email: "guest@example.com", role: "user" };
    const storedUser = Cookies.get("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return guestUser;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed || typeof parsed !== "object") return guestUser;
      if (!("name" in parsed) || !("email" in parsed) || !("role" in parsed)) return guestUser;
      return parsed;
    } catch (_e) {
      return guestUser;
    }
  });

  useEffect(() => {
    Cookies.set("user", JSON.stringify(user), { sameSite: "lax" });
  }, [user]);

  const login = (userData) => {
    Cookies.set("user", JSON.stringify(userData), { sameSite: "lax" });
    setUser(userData);
  };

  const logout = () => {
    // Instead of clearing, reset to guest user so app still works
    const guestUser = {
      name: "Guest User",
      email: "guest@example.com",
      role: "user",
    };
    Cookies.set("user", JSON.stringify(guestUser), { sameSite: "lax" });
    setUser(guestUser);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
