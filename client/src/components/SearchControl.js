import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";

const SearchControl = ({ setMarkerPosition, setFormData }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x: lng, y: lat } = result.location;
      setMarkerPosition([lat, lng]);
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setMarkerPosition, setFormData]);

  return null;
};

export default SearchControl;
