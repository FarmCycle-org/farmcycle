// LocationSection.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API from "../api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { toast } from "react-toastify";

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const pinIcon = new L.Icon({
  iconUrl: "/pin-location.png",
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
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

  const token = localStorage.getItem("token");

  const reverseGeocode = useCallback(async (lat, lng) => {
    const cacheKey = `location_name_${lat}_${lng}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setLocationName(cached);
      return;
    }

    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "WasteWiseApp/1.0 (your-email@example.com)",
          },
        }
      );

      if (data?.display_name) {
        setLocationName(data.display_name);
        localStorage.setItem(cacheKey, data.display_name);
      } else {
        setLocationName("Location name not found.");
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err);
      setLocationName("Failed to get location name.");
      toast.error("Reverse geocoding failed. Try again later.");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loc = res.data.location;
        setUserLocation(loc);

        if (loc?.coordinates) {
          const lat = loc.coordinates[1];
          const lng = loc.coordinates[0];
          setMapCenter([lat, lng]);
          setMarkerPosition([lat, lng]);
          setMapVisible(true);
          reverseGeocode(lat, lng);
        } else {
          setLocationName("No location set.");
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        setLocationName("Failed to load location.");
      }
    };
    fetchUser();
  }, [token, reverseGeocode]);

  const updateLocation = async (lng, lat) => {
    try {
      setLoading(true);
      const res = await API.patch(
        "/users/location",
        { longitude: lng, latitude: lat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserLocation(res.data.location);
      reverseGeocode(lat, lng);

      toast.success("Location updated!", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: true,
      });
    } catch (err) {
      console.error("Update location failed:", err);
      toast.error("Failed to update location. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setMapCenter([latitude, longitude]);
        setMarkerPosition([latitude, longitude]);
        setMapVisible(true);
        updateLocation(longitude, latitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast.error("Failed to get current location.");
      }
    );
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setMarkerPosition([lat, lng]);
        updateLocation(lng, lat); // 🔥 update backend right after click
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
        searchLabel: "Enter place or address",
      });

      map.addControl(searchControl);

      map.on("geosearch/showlocation", (e) => {
        const { x, y } = e.location;
        setMarkerPosition([y, x]);
        setMapCenter([y, x]);
        updateLocation(x, y); // 🔥 update backend right after search
      });

      return () => {
        map.removeControl(searchControl);
        map.off("geosearch/showlocation");
      };
    }, [map]);

    return null;
  };

  const handleManualSubmit = () => {
    if (markerPosition) {
      updateLocation(markerPosition[1], markerPosition[0]);
    } else {
      toast.warn("Please select a point on the map.");
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
