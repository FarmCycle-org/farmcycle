import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";

const CollectorHistory = () => {
  const [historyClaims, setHistoryClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/claims/my/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((claim) => {
          const isRejected = claim.status === "rejected";
          const isCollected =
            claim.status === "accepted" && claim.waste?.status === "collected";
          return isRejected || isCollected;
        });

        setHistoryClaims(filtered);
      } catch (err) {
        console.error("Failed to fetch history claims:", err);
      }
    };

    fetchClaims();
  }, []);

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">History</h1>

        {historyClaims.length === 0 ? (
          <p className="text-center text-gray-500">No past requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {historyClaims.map((claim) => (
              <div key={claim._id} className="border rounded p-4 shadow bg-white">
                <h3 className="font-semibold text-lg text-green-800">
                  {claim.waste?.title || "Untitled Waste"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Status:{" "}
                  <span className="capitalize font-medium">
                    {claim.status === "rejected" ? "Rejected" : "Collected"}
                  </span>
                </p>
                {claim.message && (
                  <p className="mt-1 text-sm text-gray-700">Your Message: {claim.message}</p>
                )}
                {claim.status === "accepted" && claim.waste?.status === "collected" && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p>Pickup completed.</p>
                    {/* Rating and review to be added here in future */}
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

export default CollectorHistory;
