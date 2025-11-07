import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "/logo_It.png"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      if (!user || !token) {
        alert("Login failed: missing data");
        return;
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-12">
        <img
          src={logo}
          alt="App Logo"
          className="w-40 h-40 object-contain mb-6 drop-shadow-lg"
        />
        <h2 className="text-3xl font-bold mb-4">Welcome to Our Platform</h2>
        <p className="text-center text-lg leading-relaxed max-w-md">
          Discover a seamless way to manage your tasks efficiently and securely.
          Login to access your personalized dashboard and get started today!
        </p>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

