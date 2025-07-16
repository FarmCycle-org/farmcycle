import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // Import Footer

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Keep showPassword state

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      login(res.data);
      console.log("Login Response:", res.data);
      console.log("Redirecting to:", `/${res.data.user.role}/dashboard`);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container matching Register.js
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {/* Main content area, flex-grow to push footer to bottom */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        {/* Card container matching Register.js styling */}
        <div className="max-w-md w-full bg-gray-50 p-8 rounded-xl shadow-lg"> {/* Reduced max-w to md for login form */}
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700"> {/* Consistent heading style */}
            Login to FarmCycle
          </h2>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>} {/* Consistent error style */}

          <form onSubmit={handleSubmit} className="space-y-4"> {/* Consistent spacing */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              // Consistent input styling
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                // Consistent input styling
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                // Consistent show/hide button styling
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-emerald-600 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              // Consistent button styling
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-center text-md">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                // Consistent link button styling
                className="text-emerald-600 hover:underline font-medium"
              >
                Register Now
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default Login;