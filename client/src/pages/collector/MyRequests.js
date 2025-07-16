import React, { useEffect, useState, useCallback } from "react"; // Import useCallback if you want to use it
import CollectorNavbar from "../../components/CollectorNavbar";
import API from "../../services/api";
import { toast } from 'react-toastify';

const MyRequests = () => {
  const [claims, setClaims] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
    "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00",
    "21:00-22:00", "22:00-23:00"
  ];

  // --- Move fetchData definition outside useEffect ---
  // Use useCallback to memoize the function if it depends on state/props,
  // to prevent unnecessary re-renders when passed as a dependency.
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const claimsRes = await API.get("/claims/my/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredClaims = claimsRes.data.filter(claim => {
        if (!claim.waste) return false;
        const isPending = claim.status === "pending";
        const isAcceptedAndNotCollected =
          claim.status === "accepted" && claim.waste.status !== "collected";
        return isPending || isAcceptedAndNotCollected;
      });

      // Sort Claims
      const sortedClaims = filteredClaims.sort((a, b) => {
        const dateA = new Date(a.createdAt || a._id.getTimestamp());
        const dateB = new Date(b.createdAt || b._id.getTimestamp());
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
      setClaims(sortedClaims);

      const pickupsRes = await API.get("/pickups/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort Scheduled Pickups
      const sortedScheduledPickups = pickupsRes.data.sort((a, b) => {
          const dateA = new Date(a.scheduledTime || a.createdAt || a._id.getTimestamp());
          const dateB = new Date(b.scheduledTime || b.createdAt || b._id.getTimestamp());
          return dateB.getTime() - dateA.getTime(); // Newest first
      });
      setScheduledPickups(sortedScheduledPickups);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []); // Empty dependency array for useCallback because it only depends on localStorage/

  useEffect(() => {
    fetchData(); // Call fetchData here
  }, [fetchData]); // Add fetchData to useEffect's dependency array

  const openScheduleModal = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  const getScheduledPickup = (claimId) =>
    scheduledPickups.find((pickup) => pickup.claim === claimId);

  return (
    <>
      <CollectorNavbar />
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-800 mb-8 text-center tracking-tight">
            My Claim Requests
          </h1>
          {claims.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 text-lg">
              <p>You haven't submitted any requests yet that are pending or accepted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claims.map((claim) => {
                const pickup = getScheduledPickup(claim._id);
                return (
                  <div key={claim._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative flex flex-col">
                    {claim.status === "accepted" && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold shadow-md">
                        ✓
                      </div>
                    )}
                    <div className="p-5 flex-grow">
                      <h3 className="font-bold text-lg text-green-700 mb-2">{claim.waste?.title || "Untitled Waste"}</h3>
                      <p className="text-gray-700 text-sm mb-3">{claim.waste?.description || "No description provided."}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        Status:{" "}
                        <span className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${
                            claim.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : claim.status === "accepted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {claim.status}
                        </span>
                      </p>
                      {claim.message && (
                        <p className="mt-1 text-sm text-gray-800 italic">Collector Message: "{claim.message}"</p>
                      )}
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 p-5">
                      {pickup ? (
                        <>
                          <button className="w-full mt-2 px-4 py-2 text-white bg-gray-400 rounded-md cursor-not-allowed font-medium">Scheduled</button>
                          <p className="text-sm text-gray-500 mt-2 text-center">Scheduled for: {new Date(pickup.scheduledTime).toLocaleString()}</p>
                        </>
                      ) : claim.status === "accepted" ? (
                        <button
                          className="w-full mt-2 px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 font-semibold "
                          onClick={() => openScheduleModal(claim)}
                        >
                          Schedule Pickup
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2 text-center italic">Awaiting provider approval...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative transform -translate-y-2 scale-95 transition-all duration-300 ease-out">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-light"
              onClick={() => {
                setShowModal(false);
                setSelectedDate("");
                setSelectedTimeSlot("");
                setSelectedClaim(null);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Schedule Pickup</h2>

            <label htmlFor="scheduleDate" className="block mb-2 text-base font-medium text-gray-700">Select Date</label>
            <input
              type="date"
              id="scheduleDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />

            <label className="block mb-3 text-base font-medium text-gray-700">Select Time Slot</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedTimeSlot === slot ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 font-semibold text-lg "
              onClick={async () => {
                if (!selectedDate || !selectedTimeSlot) {
                    toast.warn("Please select both a date and a time slot.", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                    return;
                }

                const startHour = selectedTimeSlot.split("-")[0];
                const scheduledTime = new Date(`${selectedDate}T${startHour}:00`);

                try {
                  const token = localStorage.getItem("token");
                  const res = await API.post("/pickups", {
                    wasteId: selectedClaim.waste._id,
                    scheduledTime,
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  toast.success("Pickup scheduled!", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                    });

                    setShowModal(false);
                    setSelectedDate("");
                    setSelectedTimeSlot("");
                    setSelectedClaim(null);

                    // Call the now-accessible fetchData function
                    fetchData();

                } catch (err) {
                    console.error("Error scheduling pickup:", err);
                    toast.error("Failed to schedule pickup.", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                    });
                }
              }}
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyRequests;