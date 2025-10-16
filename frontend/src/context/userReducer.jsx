export const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// Reducer function to manage authentication + role state
export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token || null,
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case "UPDATE_ROLE":
      const updatedUser = { ...state.user, role: action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };

    default:
      return state;
  }
};
