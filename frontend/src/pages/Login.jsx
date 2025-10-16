import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Cookies from "js-cookie";
import { useUserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login: setUserContext } = useUserContext ? useUserContext() : { login: null };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login({ email, password });
      const role = user.role || "user";
      Cookies.set("role", role, { sameSite: "lax" });
      Cookies.set(role, JSON.stringify(user), { sameSite: "lax" });
      if (setUserContext) setUserContext(user);
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "editor") navigate("/editor/dashboard");
      else navigate("/user/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="font-['Orbitron'] bg-slate-900 text-slate-200 min-h-screen flex justify-center items-center p-5">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-lg shadow-teal-500/30"
      >
        <h2 className="text-teal-500 text-center mb-6 text-2xl font-bold">
          Login
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

        <button
          type="submit"
          className="w-full p-3 bg-teal-500 text-slate-900 font-bold rounded-md hover:bg-teal-600 transition"
        >
          Login
        </button>

        <div className="text-center mt-4 text-sm text-slate-300">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
