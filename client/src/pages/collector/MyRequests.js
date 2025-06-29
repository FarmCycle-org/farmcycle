import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";

const MyRequests = () => {
const [claims, setClaims] = useState([]);

useEffect(() => {
  const fetchClaims = async () => {
  try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/claims/my/claims", {
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setClaims(res.data);
  } catch (err) {
    console.error("Error fetching requests:", err);
  }
  };

  fetchClaims();
}, []);

return (
<>
  <CollectorNavbar />
  <div className="max-w-6xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">My Requests</h1>
      {claims.length === 0 ? (
    <p>You haven't submitted any requests yet.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {claims.map((claim) => (
      <div key={claim._id} className="border p-4 rounded relative bg-white shadow-md" >
        {claim.status === "accepted" && (
        <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow">
          ✓
        </div>
      )}
      <h3 className="font-semibold text-lg text-green-800">{claim.waste?.title}</h3>
      <p className="text-gray-700">{claim.waste?.description}</p>
      <p className="text-sm text-gray-600 mt-1">
        Status: <span className="font-medium capitalize">{claim.status}</span>
      </p>
      {claim.message && (
      <p className="mt-1 text-sm text-gray-800">Message: {claim.message}</p>
      )}
      </div>
    ))}
    </div>
    )}
  </div>
  </>
);
};

export default MyRequests;