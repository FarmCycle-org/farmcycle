import React, { useEffect, useState } from "react";
import axios from "axios";
import CollectorNavbar from "../../components/CollectorNavbar";

const ProviderProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({ name: res.data.name, contact: res.data.contact || "" });
        setProfilePicPreview(res.data.profilePictureUrl);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:5000/api/users/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handlePictureUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.post("http://localhost:5000/api/users/me/profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error uploading profile picture:", err);
    }
  };

  const handleDeletePicture = async () => {
    try {
      await axios.delete("http://localhost:5000/api/users/me/profile-picture", {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error deleting profile picture:", err);
    }
  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-700">My Profile</h1>

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          {!editMode ? (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Contact:</strong> {user.contact || "-"}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Organization:</strong> {user.organization}</p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setEditMode(true)}
              >
                Edit Info
              </button>
            </>
          ) : (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="block mb-2 w-full border px-3 py-2 rounded"
              />
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="block mb-2 w-full border px-3 py-2 rounded"
              />
              <select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="block mb-2 w-full border px-3 py-2 rounded"
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

              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center"> <div className="flex-1 w-full md:w-2/3 mb-4 md:mb-0"> <h2 className="text-xl font-bold mb-4 text-green-700">Profile Picture</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block mb-4"
        />

        <div className="flex gap-4">
          <button
            onClick={handlePictureUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload
          </button>
          {profilePicPreview && (
            <button
              onClick={handleDeletePicture}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Picture
            </button>
          )}
        </div>
        </div>
        {profilePicPreview ? (
        <img src={profilePicPreview} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-green-500" />
        ) : (
        <p className="text-gray-500 md:text-right text-center w-full md:w-auto">
        No profile picture uploaded.
        </p>
        )}

        </div>
      </div>
    </>
  );
};

export default ProviderProfile;
