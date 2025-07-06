import React, { useEffect, useState } from "react";
import axios from "axios";
import ProviderNavbar from "../../components/ProviderNavbar";

const MyListings = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wasteToDelete, setWasteToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWaste, setEditWaste] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    wasteType: "",
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
      }
    };

    fetchMyWaste();
    fetchUserLocation();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddListing = async () => {
    const { title, description, quantity, wasteType, image } = formData;
    if (!title || !description || !quantity || !wasteType || !image || !userLocation) {
      alert("Fill all fields and ensure your location is set in your profile.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("description", description);
      formDataToSend.append("quantity", quantity);
      formDataToSend.append("wasteType", wasteType);
      formDataToSend.append("latitude", userLocation.coordinates[1]);
      formDataToSend.append("longitude", userLocation.coordinates[0]);
      formDataToSend.append("image", image);

      const res = await axios.post("http://localhost:5000/api/waste", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setWasteItems((prev) => [...prev, res.data]);
      setShowModal(false);
      setFormData({ title: "", description: "", quantity: "", wasteType: "", image: null });
    } catch (err) {
      console.error("Error adding listing:", err);
      alert("Failed to add listing.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/waste/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWasteItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Listing
          </button>
        </div>

        {loading ? (
          <p>Loading listings...</p>
        ) : wasteItems.length === 0 ? (
          <p>No listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteItems.map((waste) => (
              <div key={waste._id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-green-800">{waste.title}</h2>
                <p>{waste.description}</p>
                <p className="text-sm text-gray-600">Quantity: {waste.quantity}</p>
                <p className="text-sm text-gray-600">Type: {waste.wasteType?.toUpperCase()}</p>
                {waste.location?.coordinates && (
                  <p className="text-xs text-gray-500">
                    Location: [{waste.location.coordinates[1].toFixed(4)},{" "}
                    {waste.location.coordinates[0].toFixed(4)}]
                  </p>
                )}
                <button
                  className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => {
                    setWasteToDelete(waste._id);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
                <button
                  className="ml-2 mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    setEditWaste(waste);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-700">Add Listing</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity in kg"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Waste Type</option>
                <option value="organic">Organic</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="e-waste">E-Waste</option>
                <option value="other">Other</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
                }
              />
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

      {/* Edit Modal */}
      {showEditModal && editWaste && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Edit Waste Listing</h2>
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl"
              onClick={() => {
                setShowEditModal(false);
                setEditWaste(null);
              }}
            >
              &times;
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const data = new FormData();
                data.append("title", editWaste.title || "");
                data.append("description", editWaste.description || "");
                data.append("quantity", editWaste.quantity || "");
                data.append("wasteType", editWaste.wasteType || "");
                if (editWaste.imageFile) {
                  data.append("image", editWaste.imageFile);
                }

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

                  const updated = res.data.waste;
                  setWasteItems((prev) =>
                    prev.map((w) => (w._id === updated._id ? updated : w))
                  );
                  setShowEditModal(false);
                  setEditWaste(null);
                  alert("Listing updated successfully.");
                } catch (err) {
                  console.error("Update error:", err);
                  alert("Failed to update.");
                }
              }}
            >
              <input
                className="block w-full border px-3 py-2 rounded mb-2"
                placeholder="Title"
                value={editWaste.title}
                onChange={(e) =>
                  setEditWaste((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                className="block w-full border px-3 py-2 rounded mb-2"
                placeholder="Description"
                value={editWaste.description}
                onChange={(e) =>
                  setEditWaste((prev) => ({ ...prev, description: e.target.value }))
                }
              />
              <input
                className="block w-full border px-3 py-2 rounded mb-2"
                placeholder="Quantity"
                value={editWaste.quantity}
                onChange={(e) =>
                  setEditWaste((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
              <select
                className="block w-full border px-3 py-2 rounded mb-2"
                value={editWaste.wasteType}
                onChange={(e) =>
                  setEditWaste((prev) => ({ ...prev, wasteType: e.target.value }))
                }
              >
                <option value="">Select Waste Type</option>
                <option value="organic">Organic</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="e-waste">E-Waste</option>
                <option value="other">Other</option>
              </select>
              <input
                type="file"
                className="block mb-4"
                onChange={(e) =>
                  setEditWaste((prev) => ({
                    ...prev,
                    imageFile: e.target.files[0],
                  }))
                }
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyListings;
