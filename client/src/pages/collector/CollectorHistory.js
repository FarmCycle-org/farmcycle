import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import API from "../../services/api";
import Modal from "react-modal";
import { toast } from 'react-toastify';

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
          API.get("/claims/my/claims", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/pickups/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/reviews/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const filtered = claimsRes.data.filter((claim) => {
          const isRejected = claim.status === "rejected";
          const isCollected =
            claim.status === "accepted" && claim.waste?.status === "collected";
          return isRejected || isCollected;
        });

        // --- SOLUTION START: Sort historyClaims ---
        const sortedHistoryClaims = filtered.sort((a, b) => {
          // Prioritize 'updatedAt' if available (e.g., when status changes to collected/rejected)
          // Otherwise, fall back to 'createdAt' or MongoDB '_id' timestamp
          const dateA = new Date(a.updatedAt || a.createdAt || a._id.getTimestamp());
          const dateB = new Date(b.updatedAt || b.createdAt || b._id.getTimestamp());
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });

        setHistoryClaims(sortedHistoryClaims);
        // --- SOLUTION END: Sort historyClaims ---

        setPickups(pickupsRes.data);
        setReviewedPickupIds(reviewsRes.data.map((review) => review.pickup));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchEverything();
  }, [token]); // token is a dependency here

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
      if (!pickupId || rating < 1) {
        toast.warn("Please select a pickup and provide a rating.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
        });
        return;
      }

      await API.post(
        "/reviews",
        {
          pickupId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
      });

      setReviewedPickupIds((prev) => [...prev, pickupId]);
      closeModal();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <>
      <CollectorNavbar />
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-800 mb-8 text-center tracking-tight">
            My History
          </h1>

          {historyClaims.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600 text-lg">
              <p>No past requests found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyClaims.map((claim) => {
                const pickup = getPickupForClaim(claim._id);
                const isCollected =
                  claim.status === "accepted" && claim.waste?.status === "collected";
                const alreadyReviewed = pickup && reviewedPickupIds.includes(pickup._id);

                return (
                  <div
                    key={claim._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col"
                  >
                    <div className="p-5 flex-grow">
                      <h3 className="font-bold text-lg text-green-700 mb-2">
                        {claim.waste?.title || "Untitled Waste"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Status:{" "}
                        <span className={`capitalize font-semibold ${
                            claim.status === "rejected" ? "text-red-600" : "text-green-600"
                        }`}>
                          {claim.status === "rejected" ? "Rejected" : "Collected"}
                        </span>
                      </p>
                      {claim.message && (
                        <p className="mt-1 text-sm text-gray-700 italic">
                          Your Message: "{claim.message}"
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-700">
                        Picked up from:{" "}
                        <strong className="text-green-800">{claim?.waste?.createdBy?.name || "Provider"}</strong>
                      </p>
                    </div>

                    {isCollected && pickup && (
                      <div className="bg-gray-50 border-t border-gray-100 p-5">
                        <p className="text-sm text-gray-600 mb-1">Pickup completed.</p>
                        <p className="text-sm text-gray-500 mb-3">
                          Scheduled Time: {new Date(pickup.scheduledTime).toLocaleString()}
                        </p>
                        {!alreadyReviewed ? (
                          <button
                            onClick={() => openModal(claim)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md "
                          >
                            Submit Review
                          </button>
                        ) : (
                          <p className="text-sm text-green-600 font-medium flex items-center justify-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Review submitted
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Submit Review"
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto my-20 transform -translate-y-2 scale-95 transition-all duration-300 ease-out"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 ease-in-out"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-5 text-center">Submit Your Review</h2>
        <div className="flex justify-center space-x-1 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl cursor-pointer transition-colors duration-200 ${
                star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 resize-none"
          placeholder="Write a comment (optional)..."
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="text-gray-700 hover:text-gray-900 px-5 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit Review
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CollectorHistory;