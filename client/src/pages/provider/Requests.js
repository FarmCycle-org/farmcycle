import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const Requests = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState([]);
  const token = localStorage.getItem("token");

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
        setClaims(claimsRes.data);
        setPickups(pickupsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleAction = async (claimId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/claims/${claimId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Claim ${action === "approve" ? "approved" : "rejected"} successfully.`);
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId ? { ...claim, status: action === "approve" ? "accepted" : "rejected" } : claim
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} claim:`, err);
      alert(`Failed to ${action} claim.`);
    }
  };

  const handleMarkCollected = async (pickupId, wasteId) => {
    try {
      // Step 1: Mark pickup as complete
      await axios.put(`http://localhost:5000/api/pickups/${pickupId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Step 2: Mark waste as collected
      await axios.put(`http://localhost:5000/api/waste/${wasteId}/collected`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pickup marked as collected.");

      // Update UI
      setPickups((prev) =>
        prev.map((p) =>
          p._id === pickupId ? { ...p, status: "completed" } : p
        )
      );
    } catch (err) {
      console.error("Failed to mark pickup and waste as collected:", err);
      alert("Failed to mark as collected.");
    }
  };

  // ✅ Fix: Define this helper to fetch pickup by claim ID
  const getPickupForClaim = (claimId) => {
    return pickups.find((pickup) => pickup.claim === claimId);
  };

  return (
    <>
      <ProviderNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Claim Requests</h1>

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : claims.length === 0 ? (
          <p className="text-center text-gray-600">No requests received yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claims.map((claim) => {
              const pickup = getPickupForClaim(claim._id);
              return (
                <div key={claim._id} className="border p-4 rounded shadow bg-white">
                  <h3 className="font-semibold text-lg text-green-800 mb-1">{claim.waste?.title}</h3>
                  <p className="text-gray-700">{claim.message}</p>
                  <p className="text-sm text-gray-600 mt-2">Status: <span className="font-medium">{claim.status}</span></p>
                  {claim.collector && (
                    <p className="text-sm text-gray-500 mt-1">
                      Collector: {claim.collector.name} ({claim.collector.email})
                    </p>
                  )}
                  {claim.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleAction(claim._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(claim._id, "reject")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {claim.status === "accepted" && pickup && (
                    <div className="mt-4 border-t pt-2">
                      <p className="text-sm text-green-700 font-medium">
                        Scheduled for: {new Date(pickup.scheduledTime).toLocaleString()}
                      </p>
                      {pickup.status === "scheduled" && (
                        <button
                          onClick={() => handleMarkCollected(pickup._id, pickup.waste?._id || pickup.waste)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Mark as Collected
                        </button>
                      )}
                      {pickup.status === "completed" && (
                        <p className="mt-2 text-sm text-gray-600">Pickup marked as collected.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;
