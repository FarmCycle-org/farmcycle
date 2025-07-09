import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar"; // Ensure this path is correct

const MyListings = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // Renamed for clarity
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wasteToDelete, setWasteToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWaste, setEditWaste] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    wasteType: "", // This will hold the selected new enum value
    image: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyWaste = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/waste/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const active = res.data.filter((item) => item.status !== "collected");
        setWasteItems(active);
      } catch (err) {
        console.error("Error fetching listings:", err);
        // Optionally set an error state here to display a message to the user
      } finally {
        setLoading(false);
      }
    };

    const fetchUserLocation = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserLocation(res.data.location);
      } catch (err) {
        console.error("Error fetching user location:", err);
        // Optionally alert user to set location if it's critical for listings
      }
    };

    fetchMyWaste();
    fetchUserLocation();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddListing = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const { title, description, quantity, wasteType, image } = formData;
    if (!title || !description || !quantity || !wasteType || !image) {
      alert("Please fill all fields for the listing.");
      return;
    }
    if (!userLocation || !userLocation.coordinates || userLocation.coordinates.length !== 2) {
      alert("Your location is not set. Please update your profile with your location to add listings.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("description", description);
      formDataToSend.append("quantity", quantity);
      formDataToSend.append("wasteType", wasteType); // This will now send the correct enum value
      formDataToSend.append("latitude", userLocation.coordinates[1]); // Ensure correct lat/long order
      formDataToSend.append("longitude", userLocation.coordinates[0]); // Ensure correct lat/long order
      formDataToSend.append("image", image);

      const res = await axios.post("http://localhost:5000/api/waste", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setWasteItems((prev) => [...prev, res.data]);
      setShowAddModal(false); // Changed from setShowModal
      setFormData({ title: "", description: "", quantity: "", wasteType: "", image: null });
      alert("Listing added successfully!");
    } catch (err) {
      console.error("Error adding listing:", err);
      // Log the full error response from the backend if available
      if (err.response && err.response.data) {
        console.error("Backend error details:", err.response.data);
        alert(`Failed to add listing: ${err.response.data.message || 'Please try again.'}`);
      } else {
        alert("Failed to add listing. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/waste/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteItems((prev) => prev.filter((item) => item._id !== id));
      setShowDeleteModal(false); // Close delete modal after success
      setWasteToDelete(null); // Reset
      alert("Listing deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete listing. Please try again.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditWaste((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    setEditWaste((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleUpdateListing = async (e) => {
    e.preventDefault();
    if (!editWaste) return;

    const data = new FormData();
    data.append("title", editWaste.title || "");
    data.append("description", editWaste.description || "");
    data.append("quantity", editWaste.quantity || "");
    data.append("wasteType", editWaste.wasteType || ""); // This will now send the correct enum value
    if (editWaste.imageFile) {
      data.append("image", editWaste.imageFile);
    }
    // Location is already associated with the waste item, no need to send again unless it's being updated

    try {
      const res = await axios.put(
        `http://localhost:5000/api/waste/${editWaste._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data.waste; // Assuming your API returns { waste: updatedWasteObject }
      setWasteItems((prev) =>
        prev.map((w) => (w._id === updated._id ? updated : w))
      );
      setShowEditModal(false);
      setEditWaste(null);
      alert("Listing updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      if (err.response && err.response.data) {
        console.error("Backend error details:", err.response.data);
        alert(`Failed to update listing: ${err.response.data.message || 'Please try again.'}`);
      } else {
        alert("Failed to update listing. Please try again.");
      }
    }
  };


  return (
    <>
      <ProviderNavbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">My Waste Listings</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors duration-200 shadow-md"
            >
              Add New Listing
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading listings...</p>
          ) : wasteItems.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">You haven't created any active listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wasteItems.map((waste) => (
                <div key={waste._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-[#60e4a4]/20 transition-shadow duration-300 flex flex-col ">
                  {waste.imageUrl && (
                    <img
                      src={waste.imageUrl}
                      alt={waste.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{waste.title}</h2>
                  <p className="text-gray-700 text-sm flex-grow mb-2">{waste.description}</p>
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p><strong>Quantity:</strong> {waste.quantity} kg</p>
                    <p><strong>Waste Type:</strong> <span className="capitalize">{waste.wasteType}</span></p>
                    {waste.location?.coordinates && (
                      <p>
                        <strong>Location:</strong> [{waste.location.coordinates[1].toFixed(4)},{" "}
                        {waste.location.coordinates[0].toFixed(4)}]
                      </p>
                    )}
                    <p><strong>Status:</strong> <span className="capitalize text-emerald-700 font-semibold">{waste.status || 'Available'}</span></p>
                  </div>
                  <div className="flex space-x-2 mt-auto">
                    <button
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 text-sm"
                      onClick={() => {
                        setEditWaste(waste);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm"
                      onClick={() => {
                        setWasteToDelete(waste._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add New Waste Listing</h2>
            <form onSubmit={handleAddListing} className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title (e.g., Leftover Vegetables)"
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description (e.g., 5kg of mixed organic waste, suitable for composting)"
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                required
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity in kg (e.g., 10)"
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="0.1"
                required
              />
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              >
                <option value="">Select Waste Type</option>
                {/* UPDATED VALUES HERE */}
                <option value="Food Scraps">Food Scraps</option>
                <option value="Yard/Garden Waste">Yard/Garden Waste</option>
                <option value="Agricultural Waste">Agricultural Waste</option>
                <option value="Compostable Paper/Cardboard">Compostable Paper/Cardboard</option>
                <option value="Other Organic Material">Other Organic Material</option>
              </select>
              <div>
                <label htmlFor="imageUpload" className="block text-gray-700 text-sm font-medium mb-2">Upload Image (Optional but Recommended):</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
                  }
                  className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              {!userLocation && (
                <p className="text-red-600 text-sm">Please update your profile with your location to enable listings.</p>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userLocation}
              >
                Add Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editWaste && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Waste Listing</h2>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light"
              onClick={() => {
                setShowEditModal(false);
                setEditWaste(null);
              }}
            >
              &times;
            </button>

            <form onSubmit={handleUpdateListing} className="space-y-4">
              <input
                className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Title"
                name="title"
                value={editWaste.title}
                onChange={handleEditChange}
                required
              />
              <textarea
                className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                placeholder="Description"
                name="description"
                value={editWaste.description}
                onChange={handleEditChange}
                required
              />
              <input
                className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Quantity"
                name="quantity"
                value={editWaste.quantity}
                onChange={handleEditChange}
                type="number"
                min="0"
                step="0.1"
                required
              />
              <select
                className="block w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                name="wasteType"
                value={editWaste.wasteType}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Waste Type</option>
                {/* UPDATED VALUES HERE */}
                <option value="Food Scraps">Food Scraps</option>
                <option value="Yard/Garden Waste">Yard/Garden Waste</option>
                <option value="Agricultural Waste">Agricultural Waste</option>
                <option value="Compostable Paper/Cardboard">Compostable Paper/Cardboard</option>
                <option value="Other Organic Material">Other Organic Material</option>
              </select>
              <div>
                <label htmlFor="editImageUpload" className="block text-gray-700 text-sm font-medium mb-2">Change Image (Optional):</label>
                <input
                  type="file"
                  id="editImageUpload"
                  className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  onChange={handleEditImageChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md font-semibold shadow-md transition-colors duration-200"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && wasteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this listing?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(wasteToDelete)}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
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