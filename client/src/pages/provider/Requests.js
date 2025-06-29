import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const Requests = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/claims/provider/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClaims(res.data);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
        alert("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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
            {claims.map((claim) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Requests;
