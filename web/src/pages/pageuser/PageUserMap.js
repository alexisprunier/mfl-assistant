import L from "leaflet";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
} from "react-leaflet";
import "statics/leaflet.css";
import "./PageUserMap.css";
import { useOutletContext } from "react-router-dom";
import { getClubs, getPlayerCountPerCountry } from "services/api-assistant.js";
import { countries, cities } from "utils/geography.js";

interface PageUserMapProps {}

const PageUserMap: React.FC<PageUserMapProps> = () => {
  const user = useOutletContext();

  const [clubs, setClubs] = useState(null);
  const [playerCountPerCountry, setPlayerCountPerCountry] = useState(null);
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

  const fetchPlayerCountPerCountry = () => {
    getPlayerCountPerCountry({
      handleSuccess: (d) => {
        setPlayerCountPerCountry(d.data.getPlayerCountPerCountry);
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
      const markerPositions = [];

      clubs.map((club) => {
        if (club.city in cities) {
          markerPositions.push({
            id: club.id,
            city: club.city,
            position: cities[club.city],
          });
        } else {
          console.log("lat/long not found for : " + club.city);
        }
      });

      setMarkers(markerPositions);
    } else {
      setMarkers(null);
    }
  }, [clubs]);

  useEffect(() => {
    if (user) {
      fetchClubs();
      fetchPlayerCountPerCountry();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchClubs();
      fetchPlayerCountPerCountry();
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

        {playerCountPerCountry &&
          playerCountPerCountry.map(({ key, count }) => {
            const coords = countries[key];
            if (!coords) return null;

            return (
              <CircleMarker
                key={key}
                center={coords}
                radius={Math.log(count + 1) * 5}
                color="#0dcaf0"
                fillColor="#0dcaf0"
                fillOpacity={0.5}
              >
                <Popup>
                  <strong>{key.replace("_", " ")}</strong> <br />
                  Player(s): {count}
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default PageUserMap;
