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
    <nav className="mx-auto flex justify-between items-center py-4 px-6 bg-emerald-600 w-full shadow-md">
      <Link to="/provider/dashboard" className="text-2xl font-bold text-gray-800">
        FarmCycle
      </Link>

      <ul className="flex space-x-6 text-lg">
        <li><Link to="/provider/dashboard" className="text-white hover:text-gray-800">Dashboard</Link></li>
        <li><Link to="/provider/my-listings" className="text-white hover:text-gray-800">My Listings</Link></li>
        <li><Link to="/provider/requests" className="text-white hover:text-gray-800">Requests</Link></li>
        {/* New Notifications Link */}
        <li><Link to="/provider/notifications" className="text-white hover:text-gray-800">Notifications</Link></li>
        <li><Link to="/provider/profile" className="text-white hover:text-gray-800">Profile</Link></li>
        <li><Link to="/provider/history" className="text-white hover:text-gray-800">History</Link></li>
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
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default ProviderNavbar;
