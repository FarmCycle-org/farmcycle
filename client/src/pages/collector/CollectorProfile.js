import React, { useEffect, useState } from "react";
import API from "../../services/api";
import CollectorNavbar from "../../components/CollectorNavbar"; // Assuming CollectorNavbar is correct
import LocationSection from "../../components/LocationSection";
import { FaCamera, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Import Font Awesome icons

const CollectorProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "", organization: "" }); // Added organization to formData
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");
  const [userHasLocation, setUserHasLocation] = useState(true);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false); // New state for picture edit mode

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({ name: res.data.name, contact: res.data.contact || "", organization: res.data.organization || "" });
        setProfilePicPreview(res.data.profilePictureUrl);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const coords = res.data?.location?.coordinates;
        setUserHasLocation(Array.isArray(coords) && coords.length === 2);
      } catch (err) {
        console.error("Failed to check user location:", err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await API.put("/users/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      // Optional: Re-fetch profile to ensure UI is updated with latest data
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePictureUpload = async () => {
    if (!file) return;
    const uploadFormData = new FormData(); // Use a different variable name to avoid conflict
    uploadFormData.append("image", file);
    try {
      await API.post("/users/me/profile-picture", uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Refresh profile to show new picture
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setProfilePicPreview(res.data.profilePictureUrl);
      setFile(null); // Clear selected file
      setIsEditingProfilePicture(false); // Exit edit mode
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  };

  const handleDeletePicture = async () => {
    try {
      await API.delete("/users/me/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh profile to remove picture
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setProfilePicPreview(null);
      setFile(null); // Clear selected file
      setIsEditingProfilePicture(false); // Exit edit mode
    } catch (err) {
      console.error("Error deleting profile picture:", err);
    }
  };

  if (!user) return <p className="p-4 text-center text-gray-600">Loading profile data...</p>;

  return (
    <>
      <CollectorNavbar />
      <div className="min-h-screen bg-gray-100 py-8">
        {!userHasLocation && (
          <div className="bg-yellow-100 text-yellow-800 text-sm text-center py-2 px-4 rounded-lg shadow-md mx-auto max-w-7xl mb-6">
            ⚠️ You haven't added your location.{" "}
            <a href="/collector/profile" className="underline text-blue-600 hover:text-blue-800 font-medium">
              Click here to set
            </a>
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 py-8"> {/* Adjusted padding */}
          <h1 className="text-4xl font-extrabold text-green-800 mb-8 text-center tracking-tight">My Profile</h1>

          {/* Profile Picture Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative">
            <div className="relative">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-green-500 shadow-md" />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl border-4 border-gray-300 shadow-md">
                  <FaCamera />
                </div>
              )}
              <button
                onClick={() => setIsEditingProfilePicture(!isEditingProfilePicture)}
                className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors duration-200"
                aria-label="Edit Profile Picture"
              >
                <FaCamera className="text-xl" />
              </button>
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Profile Photo</h2>
              <p className="text-gray-600">Update your profile picture to personalize your account.</p>
              {isEditingProfilePicture && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                    <button
                        onClick={() => setIsEditingProfilePicture(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                  <h3 className="font-semibold text-lg mb-3">Manage Photo</h3>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-200 file:text-green-700 hover:file:bg-green-100 mb-4"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handlePictureUpload}
                      className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                      disabled={!file}
                    >
                      Upload <FaCamera />
                    </button>
                    {profilePicPreview && (
                      <button
                        onClick={handleDeletePicture}
                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        Delete <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Information Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-6">Personal Information</h2>
            {!editMode ? (
              <>
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-800">Name:</strong> {user.name}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-800">Email:</strong> {user.email}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-800">Contact:</strong> {user.contact || "-"}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-800">Role:</strong> {user.role}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                  <strong className="text-gray-800">Organization:</strong> {user.organization || "-"}
                </p>
                <button
                  className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setEditMode(true)}
                >
                  Edit Info
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Contact:</label>
                  <input
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Your Contact Number"
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="organization" className="block text-gray-700 text-sm font-bold mb-2">Organization:</label>
                  <select
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Organization</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="catering service">Catering Service</option>
                    <option value="school/university">School/University</option>
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
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    Save 
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Location Section - Assuming it's a self-contained styled component */}
          <LocationSection />
        </div>
      </div>
    </>
  );
};

export default CollectorProfile;
