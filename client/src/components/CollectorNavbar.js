// src/components/CollectorNavbar.js
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CollectorNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">♻️ FarmCycle</h1>
      <ul className="flex space-x-6 text-lg">
        <li><Link to="/collector/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/collector/browse" className="hover:underline">Browse</Link></li>
        <li><Link to="/collector/my-requests" className="hover:underline">My Requests</Link></li>
        <li><Link to="/collector/profile" className="hover:underline">Profile</Link></li>
      </ul>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-blue-100 font-semibold"
      >
        Logout
      </button>
    </nav>
  );
};

export default CollectorNavbar;
