// src/components/ProviderNavbar.js
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProviderNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🌿 FarmCycle</h1>
      <ul className="flex space-x-6 text-lg">
        <li><Link to="/provider/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/provider/my-listings" className="hover:underline">My Listings</Link></li>
        <li><Link to="/provider/requests" className="hover:underline">Requests</Link></li>
        <li><Link to="/provider/profile" className="hover:underline">Profile</Link></li>
      </ul>
      <button
        onClick={handleLogout}
        className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 font-semibold"
      >
        Logout
      </button>
    </nav>
  );
};

export default ProviderNavbar;
