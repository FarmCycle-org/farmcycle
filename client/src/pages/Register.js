import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider",
    contact: "",
    organization: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      login(res.data);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 to-emerald-500 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Register to FarmCycle
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>


          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="provider">I Have Waste (Provider)</option>
            <option value="collector">I Need Waste (Collector)</option>
          </select>

          <label className="block mb-1 font-medium text-gray-700">Organization Type <span className="text-red-500">*</span></label>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded mb-4"
          >
            <option value="">Select Organization Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="catering service">Catering Service</option>
            <option value="school/university">School / University</option>
            <option value="corporate office">Corporate Office</option>
            <option value="solo">Solo</option>
            <option value="household">Household</option>
            <option value="grocery store">Grocery Store</option>
            <option value="vendor">Vendor</option>
            <option value="factory">Factory</option>
            <option value="farm">Farm</option>
            <option value="recycling center">Recycling Center</option>
            <option value="composting unit">Composting Unit</option>
            <option value="environmental NGO">Environmental NGO</option>
          </select>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="mt-4 text-center text-md">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline font-medium">
              Login
            </button>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
