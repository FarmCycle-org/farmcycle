// src/pages/provider/Requests.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const Requests = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState([]);
  const token = localStorage.getItem("token");

  // Custom Message Box State and Function
  const [messageBox, setMessageBox] = useState({ visible: false, message: "", type: "" });

  const showCustomMessageBox = (message, type) => {
    setMessageBox({ visible: true, message, type });
    setTimeout(() => {
      setMessageBox({ visible: false, message: "", type: "" });
    }, 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claimsRes, pickupsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/claims/provider/claims", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/pickups/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // filter out claims whose associated waste is already collected
        const filteredClaims = claimsRes.data.filter(
          (claim) => claim.waste && claim.waste.status !== "collected"
        );

        setClaims(filteredClaims);
        setPickups(pickupsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showCustomMessageBox("Failed to fetch requests.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAction = async (claimId, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/claims/${claimId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showCustomMessageBox(
        `Claim ${action === "approve" ? "approved" : "rejected"} successfully.`,
        "success"
      );
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId
            ? { ...claim, status: action === "approve" ? "accepted" : "rejected" }
            : claim
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} claim:`, err);
      showCustomMessageBox(`Failed to ${action} claim.`, "error");
    }
  };

  const handleMarkCollected = async (pickupId, wasteId) => {
    try {
      // Step 1: Mark pickup as complete
      await axios.put(
        `http://localhost:5000/api/pickups/${pickupId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step 2: Mark waste as collected
      await axios.put(
        `http://localhost:5000/api/waste/${wasteId}/collected`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showCustomMessageBox("Pickup marked as collected.", "success");

      // Update UI
      setPickups((prev) =>
        prev.map((p) => (p._id === pickupId ? { ...p, status: "completed" } : p))
      );
      // Also update the claim's waste status to reflect the collection
      setClaims((prev) =>
        prev.map((claim) =>
          claim.waste?._id === wasteId
            ? { ...claim, waste: { ...claim.waste, status: "collected" } }
            : claim
        ).filter(claim => claim.waste.status !== "collected") // Filter out collected claims from the view
      );
    } catch (err) {
      console.error("Failed to mark pickup and waste as collected:", err);
      showCustomMessageBox("Failed to mark as collected.", "error");
    }
  };

  // Helper to find pickup by claim ID
  const getPickupForClaim = (claimId) => {
    return pickups.find((pickup) => pickup.claim === claimId);
  };

  return (
    <>
      <ProviderNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Claim Requests
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading requests...</p>
        ) : claims.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">No pending or accepted requests found where waste is not yet collected.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claims.map((claim) => {
              const pickup = getPickupForClaim(claim._id);
              const isWasteCollected = claim.waste?.status === "collected";

              // Only show claims that are either pending or accepted but not collected
              if (isWasteCollected) {
                return null;
              }

              return (
                <div
                  key={claim._id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-green-800 mb-2">
                      {claim.waste?.title || "N/A"}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3">
                      {claim.message || "No message provided."}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${
                          claim.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : claim.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </p>
                    {claim.collector && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Collector:</span>{" "}
                        {claim.collector.name} ({claim.collector.email})
                      </p>
                    )}
                  </div>

                  {claim.status === "pending" && (
                    <div className="bg-gray-50 px-5 py-4 flex justify-end gap-3">
                      <button
                        onClick={() => handleAction(claim._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(claim._id, "reject")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {claim.status === "accepted" && pickup && (
                    <div className="bg-blue-50 px-5 py-4 border-t border-blue-100">
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        Scheduled for:{" "}
                        {new Date(pickup.scheduledTime).toLocaleString()}
                      </p>
                      {pickup.status === "scheduled" && (
                        <button
                          onClick={() =>
                            handleMarkCollected(
                              pickup._id,
                              pickup.waste?._id || pickup.waste
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                        >
                          Mark as Collected
                        </button>
                      )}
                      {pickup.status === "completed" && (
                        <p className="text-sm text-gray-600 italic">
                          Pickup successfully marked as collected.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Message Box UI */}
      {messageBox.visible && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-fade-in-up ${
            messageBox.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {messageBox.message}
        </div>
      )}
    </>
  );
};

export default Requests;
