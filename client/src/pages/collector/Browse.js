import React, { useEffect, useState } from "react";
import CollectorNavbar from "../../components/CollectorNavbar";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

const WASTE_TYPES = ["Food Scraps",
        "Yard/Garden Waste",
        "Agricultural Waste",
        "Compostable Paper/Cardboard",
        "Other Organic Material"];

const ORGANIZATION_TYPES = [
  'restaurant', 'hotel','catering service', 'school/university','corporate office', 'solo', 'household',
     'grocery store', 'vendor', 'factory', 'farm', 'recycling center', 'composting unit', 'environmental NGO'
];

const Browse = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claimingId, setClaimingId] = useState(null);
  const [claimedWasteIds, setClaimedWasteIds] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const [providerRatings, setProviderRatings] = useState({});

  // --- Filter States ---
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    wasteType: "",
    minQuantity: "",
    maxQuantity: "",
    organization: "", 
    createdAfter: "",
    createdBefore: "",
  });

  // Custom Message Box State and Function (replaces alert)
  const [messageBox, setMessageBox] = useState({ visible: false, message: "", type: "" });

  const showCustomMessageBox = (message, type) => {
    setMessageBox({ visible: true, message, type });
    setTimeout(() => {
      setMessageBox({ visible: false, message: "", type: "" });
    }, 3000); // Hide after 3 seconds
  };

  // Function to fetch waste listings with filters
  const fetchWasteAndClaims = async (filterParams = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Construct query parameters
      const queryParams = new URLSearchParams(filterParams).toString();
      const wasteUrl = `http://localhost:5000/api/waste${queryParams ? `?${queryParams}` : ""}`;

      // Fetch waste listings
      const wasteRes = await axios.get(wasteUrl, {
        headers: { "Authorization": `Bearer ${token}`, "Cache-Control": "no-cache" },
      });
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

      // Fetch average ratings for providers
      const uniqueProviderIds = [...new Set(wasteRes.data.map(item => item.createdBy?._id).filter(Boolean))];
      const ratingsPromises = uniqueProviderIds.map(async (providerId) => {
        try {
          const ratingRes = await axios.get(`http://localhost:5000/api/reviews/provider/${providerId}/average`);
          return { providerId, data: ratingRes.data };
        } catch (ratingErr) {
          console.error(`Error fetching rating for provider ${providerId}:`, ratingErr);
          return { providerId, data: { avgRating: null, numReviews: 0 } };
        }
      });

      const fetchedRatings = await Promise.all(ratingsPromises);
      const newProviderRatings = fetchedRatings.reduce((acc, { providerId, data }) => {
        acc[providerId] = data;
        return acc;
      }, {});
      setProviderRatings(newProviderRatings);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteAndClaims();
  }, []); // Initial fetch without filters

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
      showCustomMessageBox("Claim submitted successfully!", "success");
      setSelectedWaste(null);
      setClaimMessage("");
    } catch (err) {
      console.error("Error submitting claim:", err);
      showCustomMessageBox("Failed to submit claim.", "error");
    } finally {
      setClaimingId(null);
    }
  };

  // --- Filter Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    // Clean up empty filter values before sending
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    fetchWasteAndClaims(cleanedFilters);
    setShowFilterModal(false); // Close modal after applying
  };

  const clearFilters = () => {
    setFilters({
      wasteType: "",
      minQuantity: "",
      maxQuantity: "",
      organization: "",
      createdAfter: "",
      createdBefore: "",
    });
    fetchWasteAndClaims({}); // Fetch all wastes
    setShowFilterModal(false); // Close modal
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading waste items...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  const pinIcon = new L.Icon({
    iconUrl: "/pin-location.png", // if in public folder
    iconSize: [42, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });

  return (
    <>
      <CollectorNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-green-700 mb-6 text-center">Available Waste Items</h1>

        {/* Filter Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilterModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
            Filter
          </button>
        </div>

        {wasteItems.length === 0 ? (
          <p className="text-center text-gray-500">No waste items available.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wasteItems.map((waste) => {
              const providerId = waste.createdBy?._id;
              const ratingData = providerRatings[providerId];
              const avgRating = ratingData?.avgRating;
              const numReviews = ratingData?.numReviews;

              return (
                <div
                  key={waste._id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer flex h-52 overflow-hidden relative"
                  onClick={() => setSelectedWaste(waste)}
                >
                  {/* Rating display on top-right */}
                  {avgRating !== null && avgRating !== undefined && (
                    <div className="absolute top-2 right-2 bg-black text-white text-xs px-3 py-2 rounded-full flex items-center shadow-md">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                      </svg>
                      <span>{avgRating.toFixed(1)}</span>
                      {numReviews > 0 && <span className="ml-1">({numReviews})</span>}
                    </div>
                  )}
                  {/* Image section */}
                  {waste.imageUrl ? (
                    <img src={waste.imageUrl} alt={waste.title} className="w-52 h-full object-cover rounded-l-xl flex-shrink-0" />
                  ) : (
                    <div className="w-52 h-52 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}

                  {/* Details section */}
                  <div className="p-4 flex-1 relative">
                    <h2 className="text-xl font-bold text-green-800">{waste.title}</h2>
                    <p className="text-sm text-gray-500 mt-5">
                      Quantity: <strong>{waste.quantity || "N/A"} Kg</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Waste Type: <strong>{waste.wasteType?.toUpperCase() || "N/A"}</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Organization: <strong>{waste.createdBy?.organization?.toUpperCase() || "N/A"}</strong>
                    </p>
                    {waste.location?.coordinates && (
                      <p className="text-sm text-gray-500 mt-1">
                        Location: [{waste.location.coordinates[1].toFixed(4)}, {waste.location.coordinates[0].toFixed(4)}]
                      </p>
                    )}
                    {waste.distance !== undefined && ( // Display distance if available from geoNear
                      <p className="text-sm text-gray-500 mt-1">
                        Distance: <strong>{(waste.distance / 1000).toFixed(2)} km</strong>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-7">
                      Posted on: {new Date(waste.createdAt).toLocaleDateString()}
                    </p>
                    {claimedWasteIds.includes(waste._id) && (
                      <span className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Claimed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Message Box UI */}
      {messageBox.visible && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50
          ${messageBox.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {messageBox.message}
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowFilterModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Filter Waste Items</h2>

            <div className="mb-4">
              <label htmlFor="wasteType" className="block text-gray-700 text-sm font-bold mb-2">
                Waste Type:
              </label>
              <select
                id="wasteType"
                name="wasteType"
                value={filters.wasteType}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Types</option>
                {WASTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="minQuantity" className="block text-gray-700 text-sm font-bold mb-2">
                  Min Quantity:
                </label>
                <input
                  type="number"
                  id="minQuantity"
                  name="minQuantity"
                  value={filters.minQuantity}
                  onChange={handleFilterChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 10"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="maxQuantity" className="block text-gray-700 text-sm font-bold mb-2">
                  Max Quantity:
                </label>
                <input
                  type="number"
                  id="maxQuantity"
                  name="maxQuantity"
                  value={filters.maxQuantity}
                  onChange={handleFilterChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 100"
                />
              </div>
            </div>

            {/* --- UPDATED: Organization Filter as Dropdown --- */}
            <div className="mb-4">
              <label htmlFor="organization" className="block text-gray-700 text-sm font-bold mb-2">
                Organization Type:
              </label>
              <select
                id="organization"
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Organizations</option>
                {ORGANIZATION_TYPES.map((orgType) => (
                  <option key={orgType} value={orgType}>
                    {orgType.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            {/* --- END UPDATED --- */}

            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="createdAfter" className="block text-gray-700 text-sm font-bold mb-2">
                  Posted After:
                </label>
                <input
                  type="date"
                  id="createdAfter"
                  name="createdAfter"
                  value={filters.createdAfter}
                  onChange={handleFilterChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="createdBefore" className="block text-gray-700 text-sm font-bold mb-2">
                  Posted Before:
                </label>
                <input
                  type="date"
                  id="createdBefore"
                  name="createdBefore"
                  value={filters.createdBefore}
                  onChange={handleFilterChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Clear Filters
              </button>
              <button
                onClick={applyFilters}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Modal (unchanged) */}
      {selectedWaste && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-0 w-full max-w-4xl shadow-lg flex overflow-hidden relative">
            {/* Box B: Image Panel */}
            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
              {selectedWaste.imageUrl ? (
                <img
                  src={selectedWaste.imageUrl}
                  alt={selectedWaste.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            {/* Box A: Existing Modal Content */}
            <div className="w-1/2 p-6 relative">
              <button
                onClick={() => {
                  setSelectedWaste(null);
                  setClaimMessage("");
                }}
                className="absolute top-0 right-0 w-10 text-gray-500 hover:bg-red-500 text-3xl"
              >
                ×
              </button>

              <h2 className="text-3xl font-bold text-green-700 mb-2">
                {selectedWaste.title}
              </h2>
              <p className="text-xl text-gray-600 mb-1">{selectedWaste.description || "No description provided."}</p>
              <p className="text-base text-gray-500 mb-1">
                Quantity: <strong>{selectedWaste.quantity || "N/A"} Kg</strong>
              </p>
              <p className="text-base text-gray-500 mb-1">
                Waste type: <strong>{selectedWaste.wasteType?.toUpperCase() || "N/A"}</strong>
              </p>
              <p className="text-base text-gray-500 mb-1">
                Organization: <strong>{selectedWaste.createdBy?.organization?.toUpperCase() || "N/A"}</strong>
              </p>
              <p className="text-base text-gray-500 mb-2">
                Listed By: <strong>{selectedWaste.createdBy?.name || "N/A"}</strong>
              </p>

              <div className="h-40 rounded overflow-hidden">
                {selectedWaste?.location?.coordinates ? (
                  <MapContainer
                    center={[
                      selectedWaste.location.coordinates[1],
                      selectedWaste.location.coordinates[0],
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true} zoomControl={true} fullscreenControl={true}
                  >
                    <TileLayer
                      attribution='© OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        selectedWaste.location.coordinates[1],
                        selectedWaste.location.coordinates[0],
                      ]}
                      icon={pinIcon}
                    >
                      {/* <Popup>{selectedWaste.title}</Popup> */}
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                    No location available
                  </div>
                )}
              </div>
              <a
                href={`https://maps.google.com/maps?q={selectedWaste.location.coordinates[1]},${selectedWaste.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Google Maps
              </a>


              <textarea
                rows="3"
                placeholder="Write your claim message here..."
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mt-5 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
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
        </div>
      )}
    </>
  );
};

export default Browse;