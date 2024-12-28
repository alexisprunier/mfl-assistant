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
        const { default: Geocoder } = await import("leaflet-control-geocoder");
        const geocoder = Geocoder.nominatim();
        const markerPositions = [];

        clubs.forEach((club) => {
          console.log("fffff", club);
          geocoder.geocode(club.city + ", " + club.country, (results) => {
            console.log("dddd", results);
            if (results && results.length > 0) {
              const { center } = results[0];
              markerPositions.push({
                id: club.id,
                city: club.city,
                position: [center.lat, center.lng],
              });
              if (markerPositions.length === clubs.length) {
                console.log("ffff", markerPositions);
                setMarkers(markerPositions);
              }
            }
          });
        });
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
        {markers?.map((c) => (
          <Marker key={c.id} icon={markerIcon} position={c.position}>
            <Popup>{c.city}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PageUserMap;
