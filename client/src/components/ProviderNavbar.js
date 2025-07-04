// src/components/ProviderNavbar.js
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProviderNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfilePic(res.data.profilePictureUrl);
      } catch (err) {
        console.error("Failed to fetch profile picture:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🌿 FarmCycle</h1>
      
      <ul className="flex space-x-6 text-lg">
        <li><Link to="/provider/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/provider/my-listings" className="hover:underline">My Listings</Link></li>
        <li><Link to="/provider/requests" className="hover:underline">Requests</Link></li>
        <li><Link to="/provider/profile" className="hover:underline">Profile</Link></li>
        <li><Link to="/provider/history" className="hover:underline">History</Link></li>
      </ul>

      <div className="flex items-center gap-4">
        {profilePic && (
          <img
            src={profilePic}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-white"
          />
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default ProviderNavbar;
