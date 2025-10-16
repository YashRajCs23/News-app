import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Cookies from "js-cookie";
import { useUserContext } from "../context/UserContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const navigate = useNavigate();

  const { login: setUserContext } = useUserContext ? useUserContext() : { login: null };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signup({ email, password, role });
      const userRole = user.role || "user";
      Cookies.set("role", userRole, { sameSite: "lax" });
      Cookies.set(userRole, JSON.stringify(user), { sameSite: "lax" });
      if (setUserContext) setUserContext(user);
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "editor") navigate("/editor/dashboard");
      else navigate("/user/dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="font-['Orbitron'] bg-slate-900 text-slate-200 min-h-screen flex justify-center items-center p-5">
      <form
        onSubmit={handleSignup}
        className="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-lg shadow-teal-500/30"
      >
        <h2 className="text-teal-500 text-center mb-6 text-2xl font-bold">
          Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-slate-700 text-white focus:outline-none"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full p-3 bg-teal-500 text-slate-900 font-bold rounded-md hover:bg-teal-600 transition"
        >
          Sign Up
        </button>

        <div className="text-center mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
