import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const claimsRes = await axios.get("http://localhost:5000/api/claims/my/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredClaims = claimsRes.data.filter(claim => {
          if (!claim.waste) return false;
          const isPending = claim.status === "pending";
          const isAcceptedAndNotCollected =
            claim.status === "accepted" && claim.waste.status !== "collected";
          return isPending || isAcceptedAndNotCollected;
        });

        setClaims(filteredClaims);

        const pickupsRes = await axios.get("http://localhost:5000/api/pickups/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScheduledPickups(pickupsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const openScheduleModal = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  // This function is no longer strictly needed as the logic is directly in the button onClick,
  // but keeping it for now as per instructions not to change code logic.
  const handleScheduleSubmit = async () => {
    // This logic is moved inline to the "Confirm Schedule" button for direct handling
  };

  const getScheduledPickup = (claimId) =>
    scheduledPickups.find((pickup) => pickup.claim === claimId);

  return (
    <>
      <CollectorNavbar />
      <div className="min-h-screen bg-white py-8"> 
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-800 mb-8 text-center tracking-tight"> {/* Consistent heading style */}
            My Claim Requests
          </h1>
          {claims.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 text-lg"> {/* Consistent no data message styling */}
              <p>You haven't submitted any requests yet that are pending or accepted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Responsive grid layout */}
              {claims.map((claim) => {
                const pickup = getScheduledPickup(claim._id);
                return (
                  <div key={claim._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 relative flex flex-col"> {/* Consistent card styling */}
                    {claim.status === "accepted" && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold shadow-md"> {/* Larger checkmark badge */}
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
                          }`}> {/* Styled status badge */}
                          {claim.status}
                        </span>
                      </p>
                      {claim.message && (
                        <p className="mt-1 text-sm text-gray-800 italic">Collector Message: "{claim.message}"</p>
                      )}
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 p-5"> {/* Separated action section */}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"> {/* Consistent modal overlay */}
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl relative transform -translate-y-2 scale-95 transition-all duration-300 ease-out"> {/* Consistent modal styling */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-light" /* Larger, styled close button */
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
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200" /* Styled date input */
            />

            <label className="block mb-3 text-base font-medium text-gray-700">Select Time Slot</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"> {/* Responsive time slot grid */}
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
                  alert("Please select both date and time slot.");
                  return;
                }

                const startHour = selectedTimeSlot.split("-")[0];
                const scheduledTime = new Date(`${selectedDate}T${startHour}:00`);

                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.post("http://localhost:5000/api/pickups", {
                    wasteId: selectedClaim.waste._id,
                    scheduledTime,
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  alert("Pickup scheduled!"); // Keeping original alert as per instructions
                  setShowModal(false);
                  setSelectedDate("");
                  setSelectedTimeSlot("");
                  setSelectedClaim(null);
                  // Refresh claims and pickups to reflect the new schedule
                  // A full data refetch might be simpler than state manipulation for now
                  window.location.reload(); // Simple refresh for now to update UI
                } catch (err) {
                  console.error("Error scheduling pickup:", err);
                  alert("Failed to schedule pickup"); // Keeping original alert as per instructions
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