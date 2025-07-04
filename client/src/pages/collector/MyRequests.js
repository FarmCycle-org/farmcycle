import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";

const MyRequests = () => {
  const [claims, setClaims] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
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

  const handleScheduleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/pickups",
        {
          wasteId: selectedClaim.waste._id,
          scheduledTime: selectedSlot
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setScheduledPickups((prev) => [...prev, res.data.pickup]);
      setShowModal(false);
      setSelectedClaim(null);
      setSelectedSlot("");
    } catch (err) {
      console.error("Error scheduling pickup:", err);
      alert("Failed to schedule pickup");
    }
  };

  const getScheduledPickup = (claimId) =>
    scheduledPickups.find((pickup) => pickup.claim === claimId);

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">My Requests</h1>
        {claims.length === 0 ? (
          <p>You haven't submitted any requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {claims.map((claim) => {
              const pickup = getScheduledPickup(claim._id);
              return (
                <div key={claim._id} className="border p-4 rounded relative bg-white shadow-md">
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
                  {pickup ? (
                    <>
                      <button className="mt-3 px-4 py-1 text-white bg-gray-400 rounded cursor-not-allowed">Scheduled</button>
                      <p className="text-sm text-gray-500 mt-1">Scheduled for: {new Date(pickup.scheduledTime).toLocaleString()}</p>
                    </>
                  ) : claim.status === "accepted" ? (
                    <button
                      className="mt-3 px-4 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                      onClick={() => openScheduleModal(claim)}
                    >
                      Schedule Pickup
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && selectedClaim && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
      <button
        className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        onClick={() => {
          setShowModal(false);
          setSelectedDate("");
          setSelectedTimeSlot("");
          setSelectedClaim(null);
        }}
      >
        &times;
      </button>
      <h2 className="text-xl font-bold text-green-700 mb-4">Schedule Pickup</h2>

      {/* Date Input */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Select Date</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      {/* Time Slots */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Select Time Slot</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedTimeSlot(slot)}
            className={`border rounded px-2 py-1 text-sm ${
              selectedTimeSlot === slot ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={async () => {
          if (!selectedDate || !selectedTimeSlot) {
            alert("Please select both date and time slot.");
            return;
          }

          const startHour = selectedTimeSlot.split("-")[0]; // "10:00"
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

            alert("Pickup scheduled!");
            setShowModal(false);
            setSelectedDate("");
            setSelectedTimeSlot("");
            setSelectedClaim(null);
          } catch (err) {
            console.error("Error scheduling pickup:", err);
            alert("Failed to schedule pickup");
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
