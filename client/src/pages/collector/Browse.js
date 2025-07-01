import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";

const Browse = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimingId, setClaimingId] = useState(null);
  const [claimedWasteIds, setClaimedWasteIds] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");

  useEffect(() => {
    const fetchWasteAndClaims = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch waste listings
        const wasteRes = await axios.get("http://localhost:5000/api/waste/");
        setWasteItems(wasteRes.data);

        // Fetch user claims
        const claimsRes = await axios.get(
          "http://localhost:5000/api/claims/my/claims",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const claimedIds = claimsRes.data
        .filter((claim) => claim.waste && claim.waste._id)
        .map((claim) => claim.waste._id);
        setClaimedWasteIds(claimedIds);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteAndClaims();
  }, []);

  const handleClaimSubmit = async () => {
    if (!selectedWaste) return;
    try {
      setClaimingId(selectedWaste._id);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/claims/${selectedWaste._id}/claim`,
        { message: claimMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClaimedWasteIds((prev) => [...prev, selectedWaste._id]);
      alert("Claim submitted successfully!");
      setSelectedWaste(null);
      setClaimMessage("");
    } catch (err) {
      console.error("Error submitting claim:", err);
      alert("Failed to submit claim.");
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading waste items...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">Available Waste Items</h1>

        {wasteItems.length === 0 ? (
          <p className="text-center text-gray-500">No waste items available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteItems.map((waste) => (
              <div
                key={waste._id}
                className="relative bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedWaste(waste)}
              >
                <h2 className="text-xl font-bold text-green-800">{waste.title}</h2>
                <p className="text-gray-600 mt-1">{waste.description || "No description provided."}</p>
                <p className="text-sm text-gray-500 mt-2">Quantity: <strong>{waste.quantity || "N/A"}</strong></p>
                <p className="text-sm text-gray-500 mt-2">
                  Waste type: <strong>{waste.wasteType ? waste.wasteType.toUpperCase() : "N/A"}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">Organization: <strong>{waste.createdBy?.organization.toUpperCase() || "N/A"}</strong></p>
                {waste.location?.coordinates && (
                  <p className="text-sm text-gray-500 mt-2">
                    Location: [{waste.location.coordinates[1].toFixed(4)}, {waste.location.coordinates[0].toFixed(4)}]
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  Posted on: {new Date(waste.createdAt).toLocaleDateString()}
                </p>
                {claimedWasteIds.includes(waste._id) && (
                  <span className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Claimed
                  </span>
                )}                  
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {selectedWaste && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => {
                setSelectedWaste(null);
                setClaimMessage("");
              }}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-green-700 mb-2">
              {selectedWaste.title}
            </h2>
            <p className="text-gray-600 mb-1">{selectedWaste.description || "No description provided."}</p>
            <p className="text-sm text-gray-500 mb-2">Quantity: {selectedWaste.quantity || "N/A"}</p>
            <p className="text-sm text-gray-500 mb-2">Waste type: {selectedWaste.wasteType || "N/A"}</p>
            <div className="bg-gray-100 h-40 mb-3 flex items-center justify-center rounded">
              <span className="text-gray-500 text-sm">[Map preview placeholder]</span>
            </div>

            <textarea
              rows="3"
              placeholder="Write your claim message here..."
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleClaimSubmit}
              disabled={claimingId === selectedWaste._id || claimedWasteIds.includes(selectedWaste._id)}
              className={`w-full py-2 rounded text-white ${
                claimedWasteIds.includes(selectedWaste._id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {claimedWasteIds.includes(selectedWaste._id)
                ? "Already Claimed"
                : claimingId === selectedWaste._id
                ? "Claiming..."
                : "Claim"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Browse;
