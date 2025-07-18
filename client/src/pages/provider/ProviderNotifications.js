
import React, { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import ProviderNavbar from "../../components/ProviderNavbar"; // Import ProviderNavbar
import { toast } from 'react-toastify';

const ProviderNotifications = () => {
  const { auth } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/notifications", {
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
    // Keep the window.confirm for critical, irreversible actions like deletion.
    // Toasts are not a replacement for confirmation dialogs.
    if (!window.confirm("Are you sure you want to delete this notification?")) {
        return; // Stop if the user cancels
    }

    try {
        await API.delete(`/notifications/${id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });

        // Update your local state to reflect the deletion
        setNotifications(notifications.filter((n) => n._id !== id));

        // --- Replace alert("Notification deleted."); with toast.success() ---
        toast.success("Notification deleted.", {
            position: "bottom-center", // Or your preferred toast position
            autoClose: 2500,           // A quick display for success
            hideProgressBar: true,     // Keep it clean
        });

    } catch (err) {
        console.error("Error deleting notification:", err);

        // --- Replace alert("Failed to delete notification."); with toast.error() ---
        toast.error("Failed to delete notification. Please try again.", {
            position: "bottom-center", // Consistency with success, or choose 'top-center' for errors
            autoClose: 4000,           // Give users a bit more time to read errors
            hideProgressBar: false,    // Show the progress bar for errors
        });
    }
};


  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]); // Depend on auth.token if it might change and trigger a re-fetch

  return (
    <>
      <ProviderNavbar /> {/* Added the navbar */}
      <div
        className="min-h-screen bg-gray-50 py-8" // Changed background to a consistent light gray
      >
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg"> {/* Wrapped content in a central card */}
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Notifications</h2> {/* Larger, centered title */}
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading notifications...</p>
          ) : error ? (
            <p className="text-red-600 text-center text-lg">{error}</p> 
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">You have no notifications.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`p-4 rounded-lg border border-gray-200 bg-white shadow-sm flex justify-between items-center transition-all duration-300 hover:shadow-md hover:bg-[#60e4a4]/20`} 
                >
                  <span className="text-gray-800 text-base flex-grow mr-4">{n.message}</span> {/* Text color and flex-grow */}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-red-600 hover:text-red-800 text-2xl p-2 rounded-full hover:bg-red-50 transition-colors duration-200" // Styled trash icon button
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
    </>
  );
};

export default ProviderNotifications;