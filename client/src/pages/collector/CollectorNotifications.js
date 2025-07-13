// src/pages/collector/CollectorNotifications.js

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import CollectorNavbar from "../../components/CollectorNavbar";
import { toast } from 'react-toastify';

const CollectorNotifications = () => {
    const { auth } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State for the delete confirmation modal (inline implementation)
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [notificationToDeleteId, setNotificationToDeleteId] = useState(null); // Stores the ID to be deleted

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

    // This function is called when the user clicks the trash icon
    const openDeleteConfirmModal = (id) => {
        setNotificationToDeleteId(id); // Store the ID of the notification to be deleted
        setShowDeleteConfirmModal(true); // Open the inline confirmation modal
    };

    // This function is called when the user clicks 'Delete' in the inline modal
    const handleDeleteConfirmed = async () => {
        // Ensure we have an ID before proceeding
        if (!notificationToDeleteId) return;

        setShowDeleteConfirmModal(false); // Close the modal immediately
        const id = notificationToDeleteId; // Get the ID

        try {
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setNotifications(notifications.filter((n) => n._id !== id));

            toast.success("Notification deleted.", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
            });

        } catch (err) {
            console.error("Error deleting notification:", err);
            toast.error("Failed to delete notification. Please try again.", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
            });
        } finally {
            setNotificationToDeleteId(null); // Clear the stored ID
        }
    };

    // This function is called when the user clicks 'Cancel' in the inline modal
    const handleDeleteCancelled = () => {
        setShowDeleteConfirmModal(false); // Close the modal
        setNotificationToDeleteId(null); // Clear the stored ID
    };


    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.token]);

    return (
        <>
            <CollectorNavbar />
            <div
                className="min-h-screen bg-gray-50 py-8"
            >
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Your Notifications</h2>
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
                                    <span className="text-gray-800 text-base flex-grow mr-4">{n.message}</span>
                                    <button
                                        // Changed onClick to open the inline confirmation modal
                                        onClick={() => openDeleteConfirmModal(n._id)}
                                        className="text-red-600 hover:text-red-800 text-2xl p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
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

            {/* Delete Confirmation Modal (inline, exactly like in ProviderNotifications.js) */}
            {showDeleteConfirmModal && notificationToDeleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this notification?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDeleteCancelled} // Calls the cancel handler
                                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirmed} // Calls the confirmed delete handler
                                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CollectorNotifications;