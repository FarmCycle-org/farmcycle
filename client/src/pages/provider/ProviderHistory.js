import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const ProviderHistory = () => {
  const [collectedWastes, setCollectedWastes] = useState([]);

  useEffect(() => {
    const fetchCollected = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/waste/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const collectedOnly = res.data.filter(waste => waste.status === "collected");
        setCollectedWastes(collectedOnly);
      } catch (err) {
        console.error("Error fetching collected waste:", err);
      }
    };

    fetchCollected();
  }, []);

  return (
    <>
      <ProviderNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-8 text-center">Provider Waste History</h1>

        {collectedWastes.length === 0 ? (
          <p className="text-center text-gray-600">No waste has been marked as collected yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collectedWastes.map((waste) => (
              <div key={waste._id} className="bg-white shadow-md p-4 rounded-lg relative">
                <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold">
                  Collected
                </div>
                <h2 className="text-xl font-semibold text-green-800">{waste.title}</h2>
                <p className="text-gray-700">{waste.description}</p>
                <p className="text-sm text-gray-600 mt-1">Type: {waste.wasteType}</p>
                <p className="text-sm text-gray-600">Quantity: {waste.quantity} kg</p>
                {waste.claimedBy && (
                  <p className="text-sm text-gray-600 mt-1">
                    Collected by: <span className="font-medium">{waste.claimedBy.name}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderHistory;
