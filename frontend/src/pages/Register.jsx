import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "/logo_It.png"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // field-wise errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clear previous errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");

    if (!role) {
      setRoleError("Please select a role");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful!");
      navigate("/login");

    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg) {
        if (msg.includes("Email")) setEmailError(msg);
        else if (msg.includes("Name")) setNameError(msg);
        else if (msg.includes("Password")) setPasswordError(msg);
        else if (msg.includes("role")) setRoleError(msg);
      } else {
        setEmailError("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-12">
        <img src={logo} alt="Platform Logo" className="w-40 h-40 mb-6 drop-shadow-lg" />
        <h2 className="text-3xl font-bold mb-4">Join Our Platform</h2>
        <p className="text-center text-lg max-w-md">
          Create your free account and explore powerful tools.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME FIELD */}
            <div>
              <input
                className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
            </div>

            {/* EMAIL FIELD */}
            <div>
              <input
                type="email"
                className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <input
                type="password"
                className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            </div>

            {/* ROLE FIELD */}
            <div>
              <select
                className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Technician">Technician</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
              {roleError && <p className="text-red-600 text-sm">{roleError}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
