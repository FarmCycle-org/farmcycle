// src/pages/Register.js (Updated handleSubmit)
import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    contact: "",
    organization: ""
  });

  const [userType, setUserType] = useState(""); // This is your separate state for userType
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    console.log("User type selected:", type);
    if (type === "individual") {
      setFormData(prevData => ({ ...prevData, organization: "solo" }));
    } else {
      setFormData(prevData => ({ ...prevData, organization: "" }));
    }
    setError("");
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.role) {
      setError("Please select your role.");
      return;
    }
    if (currentStep === 2 && !userType) { // This `userType` is the state variable
      setError("Please select whether you are registering as an individual or organization.");
      return;
    }
    setError("");
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (userType === 'organization' && !formData.organization) {
        setError("Please select your organization type.");
        return;
    }

    // Crucial: Add a check to ensure userType has been selected before submitting
    if (!userType) {
        setError("User type (individual/organization) is required.");
        return;
    }

    setLoading(true);
    setError("");

    console.log("Preparing to send data:", { ...formData, userType: userType });

    try {
      const res = await API.post("/auth/register", {
        ...formData,
        userType: userType // <-- THIS IS THE FIX: Explicitly add userType here
      });
      login(res.data);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-gray-50 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-emerald-700">Create Your Account</h2>

          {/* Progress Bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    currentStep >= step ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {step}
                </div>
                {step !== 3 && (
                  <div className={`h-1 w-full ${currentStep > step ? "bg-emerald-600" : "bg-gray-300"}`}></div>
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 && (
              <div>
                <label className="block mb-1 font-medium">Select Your Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Choose...</option>
                  <option value="provider">I Have Waste (Provider)</option>
                  <option value="collector">I Need Waste (Collector)</option>
                </select>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <label className="block mb-1 font-medium">Are you registering as:</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("individual")}
                    className={`flex-1 py-2 rounded border ${
                      userType === "individual"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("organization")}
                    className={`flex-1 py-2 rounded border ${
                      userType === "organization"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    Organization
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder={
                    userType === "organization" ? "Organization Name" : "Full Name"
                  }
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={
                    userType === "organization" ? "Organization Email" : "Email Address"
                  }
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
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
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-emerald-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                />

                {userType === "organization" && (
                  <div>
                    <label className="block mb-1 font-medium">Organization Type</label>
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Select Organization Type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="catering service">Catering Service</option>
                      <option value="school/university">School / University</option>
                      <option value="corporate office">Corporate Office</option>
                      <option value="vendor">Vendor</option>
                      <option value="factory">Factory</option>
                      <option value="farm">Farm</option>
                      <option value="recycling center">Recycling Center</option>
                      <option value="composting unit">Composting Unit</option>
                      <option value="environmental NGO">Environmental NGO</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              )}
            </div>
            <p className="mt-4 text-center text-md">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:underline font-medium"
              >
                Login Now
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
