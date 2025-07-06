// src/pages/collector/CollectorNotifications.js

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaTrash } from "react-icons/fa";

const CollectorNotifications = () => {
  const { auth } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setNotifications(notifications.filter((n) => n._id !== id));
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/notificationspp.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      <div className="relative max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-semibold text-white mb-4">Your Notifications</h2>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-white">You have no notifications.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-4 rounded border bg-white/80 backdrop-blur-sm flex justify-between items-center transition-transform duration-300`}
              >
                <span className="text-gray-800">{n.message}</span>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-red-600 hover:text-red-800 text-xl"
                  aria-label="Delete notification"
                >
                   <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CollectorNotifications;

