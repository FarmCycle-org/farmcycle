import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { toast } from 'react-toastify';

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const pinIcon = new L.Icon({
  iconUrl: "/pin-location.png", // Make sure this file exists in your public folder
  iconSize: [42, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -40],
});

const LocationSection = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState("Fetching location name...");
  const [mapVisible, setMapVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // default India

  const token = localStorage.getItem("token");

  // Function to perform reverse geocoding with caching
  const reverseGeocode = useCallback(async (lat, lng) => {
    if (!lat || !lng) {
      setLocationName("Invalid coordinates.");
      return;
    }

    const cacheKey = `location_name_${lat}_${lng}`;
    const cachedResult = localStorage.getItem(cacheKey);

    if (cachedResult) {
      // Use cached result if available
      setLocationName(cachedResult);
      return;
    }

    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const response = await axios.get(nominatimUrl, {
        headers: { 'User-Agent': 'WasteWiseApp/1.0 (your-email@example.com)' }
      });

      if (response.data && response.data.display_name) {
        const displayName = response.data.display_name;
        setLocationName(displayName);
        localStorage.setItem(cacheKey, displayName); // Cache the result
      } else {
        setLocationName("Location name not found.");
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setLocationName("Failed to get location name.");
      // Optionally, show a toast for this specific error to the user
      toast.error("Failed to fetch location details (rate limit?). Try again later.", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
      });
    }
  }, []); // No dependencies, as it only uses lat/lng arguments

  // Effect to fetch user location on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedLocation = res.data.location;
        setUserLocation(fetchedLocation);

        if (fetchedLocation && fetchedLocation.coordinates) {
          const lat = fetchedLocation.coordinates[1];
          const lng = fetchedLocation.coordinates[0];
          reverseGeocode(lat, lng);
          setMapCenter([lat, lng]);
          setMarkerPosition([lat, lng]);
          setMapVisible(true);
        } else {
          setLocationName("No location set.");
          setMapVisible(false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setLocationName("Failed to load user location.");
      }
    };
    fetchUser();
  }, [token, reverseGeocode]); // Add reverseGeocode to dependencies

  // Function to update location in the backend and then reverse geocode
  const updateLocation = async (lng, lat) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        "http://localhost:5000/api/users/location",
        { longitude: lng, latitude: lat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedLocation = res.data.location;
      setUserLocation(updatedLocation);

      reverseGeocode(lat, lng);

      toast.success("Location updated!", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: true,
      });

      setMapVisible(true);
    } catch (err) {
      console.error("Error updating location:", err);
      toast.error("Failed to update location. Please try again.", {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: false,
      });
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
        console.error("Geolocation error:", err);
        toast.error("Failed to get device location. Please enable location services.", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
        });
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
        autoClose: true,
        searchLabel: 'Enter address or place name',
      });
      map.addControl(searchControl);

      map.on('geosearch/showlocation', (e) => {
        const { x, y } = e.location; // x is longitude, y is latitude
        setMarkerPosition([y, x]); // Leaflet uses [lat, lng]
        setMapCenter([y, x]); // Center map on search result
      });

      return () => {
        map.removeControl(searchControl);
        map.off('geosearch/showlocation');
      };
    }, [map]);
    return null;
  };

  const handleManualSubmit = () => {
    if (markerPosition) {
      updateLocation(markerPosition[1], markerPosition[0]); // lng, lat
    } else {
      toast.warn("Please select a point on the map by clicking or searching.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-semibold text-green-700 mb-2">Your Location</h2>

      {userLocation ? (
        <p className="text-gray-600">
          Current Location: <span className="font-medium text-gray-800">{locationName}</span>
        </p>
      ) : (
        <p className="text-red-500">{locationName}</p>
      )}

      <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleUseCurrentLocation}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Getting Location..." : "Use My Current Location"}
        </button>
        <button
          onClick={() => setMapVisible((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {mapVisible ? "Hide Map" : "Select Location Manually"}
        </button>
      </div>

      {mapVisible && (
        <div className="mt-4 h-80 rounded-lg overflow-hidden">
          <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl />
            <LocationMarker />
          </MapContainer>

          <button
            onClick={handleManualSubmit}
            className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Updating Location..." : "Confirm Selected Location"}
          </button>
        </div>
      )}

      {loading && <p className="mt-2 text-blue-500">Updating location...</p>}
    </div>
  );
};

export default LocationSection;