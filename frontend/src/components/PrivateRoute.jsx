import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children, role }) => {
  const stored = Cookies.get("user");
  let user = null;
  if (stored && stored !== "undefined" && stored !== "null") {
    try {
      user = JSON.parse(stored);
    } catch (_e) {
      user = null;
    }
  }
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
