import Cookies from "js-cookie";

export const initialState = {
  user: (() => {
    const role = Cookies.get("role");
    const cookieName = role || "user";
    const storedUser = Cookies.get(cookieName);
    if (!storedUser || storedUser === "undefined" || storedUser === "null") return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  })(),
  token: Cookies.get("token") || null,
  loading: false,
  error: null,
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS": {
      const { user, token } = action.payload;
      const role = user.role || "user";
      Cookies.set("role", role, { sameSite: "lax" });
      Cookies.set(role, token, { sameSite: "lax" });
      Cookies.set("token", token, { sameSite: "lax" });
      Cookies.set(role, JSON.stringify(user), { sameSite: "lax" });
      return {
        ...state,
        user,
        token: token || null,
        loading: false,
        error: null,
      };
    }

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT": {
      const role = Cookies.get("role");
      if (role) {
        Cookies.remove(role);
      }
      Cookies.remove("token");
      Cookies.remove("role");
      return {
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    }

    case "UPDATE_ROLE": {
      const updatedUser = { ...state.user, role: action.payload };
      const role = action.payload;
      Cookies.set("role", role, { sameSite: "lax" });
      Cookies.set(role, JSON.stringify(updatedUser), { sameSite: "lax" });
      return {
        ...state,
        user: updatedUser,
      };
    }

    default:
      return state;
  }
};
