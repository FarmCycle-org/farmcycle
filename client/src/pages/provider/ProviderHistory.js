import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar"; // Ensure this path is correct

const ProviderHistory = () => {
  const [collectedWastes, setCollectedWastes] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchCollected = async () => {
      setLoading(true); // Set loading true when fetching
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/waste/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const collectedOnly = res.data.filter(waste => waste.status === "collected");
        setCollectedWastes(collectedOnly);
      } catch (err) {
        console.error("Error fetching collected waste:", err);
        // Optionally set an error state here
      } finally {
        setLoading(false); // Set loading false after fetch
      }
    };

    fetchCollected();
  }, []);

  return (
    <>
      <ProviderNavbar />
      <div className="bg-gray-50 min-h-screen py-8"> {/* Added light background */}
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Collection History</h1> {/* Changed text color and size */}

          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading history...</p>
          ) : collectedWastes.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No waste has been marked as collected yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Consistent gap */}
              {collectedWastes.map((waste) => (
                <div key={waste._id} className="bg-white shadow-md p-6 rounded-lg relative hover:shadow-lg hover:bg-[#60e4a4]/20 transition-shadow duration-300"> {/* Increased padding, rounded-lg */}
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full px-3 py-1 text-xs font-semibold"> {/* Changed color to emerald, better padding */}
                    Collected
                  </div>
                  {waste.imageUrl && ( // Display image if available
                    <img
                      src={waste.imageUrl}
                      alt={waste.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{waste.title}</h2> {/* Changed color */}
                  <p className="text-gray-700 text-sm mb-2">{waste.description}</p> {/* Use text-gray-700 */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Type:</strong> <span className="capitalize">{waste.wasteType}</span></p>
                    <p><strong>Quantity:</strong> {waste.quantity} kg</p>
                    {waste.claimedBy && (
                      <p>
                        <strong>Collected by:</strong> <span className="font-medium text-emerald-700">{waste.claimedBy.name}</span>
                      </p>
                    )}
                    {waste.collectedAt && ( // Display collection date if available
                      <p>
                        <strong>Collection Date:</strong> {new Date(waste.collectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProviderHistory;