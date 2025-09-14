import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      console.log("User logged in:", data.user);
      navigate("/");
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
