import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

const pinIcon = new L.Icon({
  iconUrl: "/pin-location.png", // Make sure this file exists in your public folder
  iconSize: [42, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

const LocationSection = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default India

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserLocation(res.data.location);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [token]);

  const updateLocation = async (lng, lat) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        "http://localhost:5000/api/users/location",
        { longitude: lng, latitude: lat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserLocation(res.data.location);
      alert("Location updated!");
      setMapVisible(true);
    } catch (err) {
      console.error("Error updating location:", err);
      alert("Failed to update location.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMarkerPosition([latitude, longitude]);
        setMapVisible(true);
        updateLocation(longitude, latitude);
      },
      (err) => {
        console.error(err);
        alert("Failed to get device location");
      }
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return markerPosition ? <Marker position={markerPosition} icon={pinIcon} /> : null;
  };

  const SearchControl = () => {
    const map = useMapEvents({});
    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        showMarker: false,
        style: "bar",
      });
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, [map]);
    return null;
  };

  const handleManualSubmit = () => {
    if (markerPosition) {
      updateLocation(markerPosition[1], markerPosition[0]); // lng, lat
    } else {
      alert("Please select a point on the map.");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-semibold text-green-700 mb-2">Your Location</h2>

      {userLocation ? (
        <p className="text-gray-600">
          Current Location: [{userLocation.coordinates[1].toFixed(4)}, {userLocation.coordinates[0].toFixed(4)}]
        </p>
      ) : (
        <p className="text-red-500">No location set.</p>
      )}

      <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleUseCurrentLocation}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Use My Current Location
        </button>
        <button
          onClick={() => setMapVisible((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Select Location Manually
        </button>
      </div>

      {mapVisible && (
        <div className="mt-4 h-80">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl />
            <LocationMarker />
          </MapContainer>

          <button
            onClick={handleManualSubmit}
            className="mt-10 mb-10 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
          >
            Confirm Selected Location
          </button>
        </div>
      )}

      {loading && <p className="mt-2 text-blue-500">Updating location...</p>}
    </div>
  );
};

export default LocationSection;
