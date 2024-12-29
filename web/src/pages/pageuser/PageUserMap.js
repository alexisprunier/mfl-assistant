import L from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "statics/leaflet.css";
import "./PageUserMap.css";
import { useOutletContext } from "react-router-dom";
import { getClubs } from "services/api-assistant.js";

interface PageUserMapProps {}

const PageUserMap: React.FC<PageUserMapProps> = () => {
  const user = useOutletContext();

  const [clubs, setClubs] = useState(null);
  const [markers, setMarkers] = useState(null);

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs);
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id] },
    });
  };

  var markerIcon = L.icon({
    iconUrl: "/media/images/buildings-blue.svg",
    iconSize: [20, 20],
  });

  useEffect(() => {
    if (clubs) {
      const geocodeCities = async () => {
        const markerPositions = [];

        // Using the Nominatim Geocoding API via fetch
        for (const club of clubs) {
          const query = `${club.city}, ${club.country}`;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
              )}&format=json`
            );
            const results = await response.json();

            if (results && results.length > 0) {
              const { lat, lon } = results[0];
              markerPositions.push({
                id: club.id,
                city: club.city,
                position: [lat, lon],
              });
            } else {
              console.log(`No geocoding results found for ${query}`);
            }
          } catch (error) {
            console.error(`Error geocoding ${query}:`, error);
          }
        }

        // After all clubs are processed, set the markers
        if (markerPositions.length > 0) {
          setMarkers(markerPositions);
        } else {
          setMarkers(null); // No valid markers found
        }
      };

      geocodeCities();
    } else {
      setMarkers(null);
    }
  }, [clubs]);

  useEffect(() => {
    if (user) {
      fetchClubs();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchClubs();
    }
  }, [user]);

  return (
    <div id="PageUserMap" className="position-relative w-100 h-100">
      <MapContainer
        className="bg-dark h-100 w-100"
        center={[49.61, 6.13]}
        zoom={3}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        {markers?.map((c) => {
          const markerIcon = L.icon({
            iconUrl: `https://d13e14gtps4iwl.cloudfront.net/u/clubs/${c.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          return (
            <Marker key={c.id} icon={markerIcon} position={c.position}>
              <Popup>{c.city}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PageUserMap;
