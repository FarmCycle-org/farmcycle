import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const MyListings = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    wasteType: "",
    latitude: "",
    longitude: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wasteToDelete, setWasteToDelete] = useState(null);


  const token = localStorage.getItem("token");

  // Fetch provider's own listings
  useEffect(() => {
    const fetchMyWaste = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/waste/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWasteItems(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyWaste();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddListing = async () => {

    const { title, description, quantity, wasteType, latitude, longitude } = formData;

    if (!wasteType) {
      alert("Please select a waste type before submitting.");
      return;
    }

    try {
      const newWaste = {
        title,
        description,
        quantity,
        wasteType,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };

      console.log("Submitting waste:", newWaste);
      const res = await axios.post("http://localhost:5000/api/waste", newWaste, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWasteItems((prev) => [...prev, res.data]);
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        quantity: "",
        wasteType: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      console.error("Error adding listing:", err);
      alert("Failed to add listing.");
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/waste/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWasteItems((prev) => prev.filter((item) => item._id !== id));
    alert("Listing deleted successfully.");
  } catch (err) {
    console.error("Failed to delete waste:", err);
    alert("Error deleting listing.");
  }
};

  return (
    <>
      <ProviderNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-green-700">My Waste Listings</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Listing
          </button>
        </div>

        {loading ? (
          <p>Loading your listings...</p>
        ) : wasteItems.length === 0 ? (
          <p className="text-gray-600">You haven't added any listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteItems.map((waste) => (
              <div key={waste._id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-green-800">{waste.title}</h2>
                <p className="text-gray-600">{waste.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Quantity: <strong>{waste.quantity ? String(waste.quantity).toUpperCase() : "N/A"}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Waste Type: <strong>{waste.wasteType ? waste.wasteType.toUpperCase() : "N/A"}</strong>
                </p>

                {waste.location?.coordinates && (
                  <p className="text-xs text-gray-400">
                    Location: [{waste.location.coordinates[1].toFixed(4)}, {waste.location.coordinates[0].toFixed(4)}]
                  </p>
                )}
                <button
                  onClick={() => { setWasteToDelete(waste._id);
                    setShowDeleteModal(true);
                  }}
                  className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700">Add New Waste Listing</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Waste Type</option>
                <option value="organic">Organic</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="e-waste">E-Waste</option>
                <option value="other">Other</option>
              </select>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-1/2 border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-1/2 border px-3 py-2 rounded"
                />
              </div>

              <button
                onClick={handleAddListing}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Add Listing
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg relative">
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-black"
            onClick={() => setShowDeleteModal(false)}
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Delete</h2>
          <p className="text-gray-700 mb-6">Are you sure you want to delete this listing?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDelete(wasteToDelete);
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    </>
  );
};

export default MyListings;
