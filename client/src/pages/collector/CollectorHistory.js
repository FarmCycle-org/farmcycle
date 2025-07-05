import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CollectorHistory = () => {
  const [historyClaims, setHistoryClaims] = useState([]);
  const [reviewedPickupIds, setReviewedPickupIds] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pickups, setPickups] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [claimsRes, pickupsRes, reviewsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/claims/my/claims", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/pickups/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/reviews/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filtered = claimsRes.data.filter((claim) => {
          const isRejected = claim.status === "rejected";
          const isCollected =
            claim.status === "accepted" && claim.waste?.status === "collected";
          return isRejected || isCollected;
        });

        setHistoryClaims(filtered);
        setPickups(pickupsRes.data);
        setReviewedPickupIds(reviewsRes.data.map((review) => review.pickup));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchEverything();
  }, [token]);

  const getPickupForClaim = (claimId) => {
    return pickups.find(
      (pickup) =>
        pickup.claim?._id === claimId || pickup.claim === claimId
    );
  };

  const openModal = (claim) => {
    const pickup = getPickupForClaim(claim._id);
    setSelectedClaim({ ...claim, pickup });
    setRating(0);
    setComment("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  const submitReview = async () => {
    try {
      const pickupId = selectedClaim?.pickup?._id;
      if (!pickupId || rating < 1) return;

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          pickupId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted!");
      setReviewedPickupIds((prev) => [...prev, pickupId]);
      closeModal();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">History</h1>

        {historyClaims.length === 0 ? (
          <p className="text-center text-gray-500">No past requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {historyClaims.map((claim) => {
              const pickup = getPickupForClaim(claim._id);
              const isCollected =
                claim.status === "accepted" && claim.waste?.status === "collected";
              const alreadyReviewed = pickup && reviewedPickupIds.includes(pickup._id);

              return (
                <div key={claim._id} className="border rounded p-4 shadow bg-white">
                  <h3 className="font-semibold text-lg text-green-800">
                    {claim.waste?.title || "Untitled Waste"}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Status:{" "}
                    <span className="capitalize font-medium">
                      <strong>{claim.status === "rejected" ? "Rejected" : "Collected"}</strong>
                    </span>
                  </p>
                  {claim.message && (
                    <p className="mt-1 text-sm text-gray-700">
                      Your Message: {claim.message}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-700">
                    Picked up from: <strong>{claim?.waste?.createdBy?.name || "Provider" } </strong>
                  </p>

                  {isCollected && pickup && (
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Pickup completed.</p>
                      <p className="text-sm text-gray-500">
                        Scheduled Time: {new Date(pickup.scheduledTime).toLocaleString()}
                      </p>
                      {!alreadyReviewed ? (
                        <button
                          onClick={() => openModal(claim)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Submit Review
                        </button>
                      ) : (
                        <p className="mt-2 text-sm text-green-600 font-medium">Review submitted ✅</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Submit Review"
        className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Submit Your Review</h2>
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          placeholder="Write a comment (optional)..."
        />
        <div className="flex justify-end space-x-3">
          <button onClick={closeModal} className="text-gray-600 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submitReview}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CollectorHistory;
