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
import { countries } from "utils/geography.js";
import LoadingSquare from "components/loading/LoadingSquare.js";

interface PageUserMapProps {}

const PageUserMap: React.FC<PageUserMapProps> = () => {
  const user = useOutletContext();

  const [clubs, setClubs] = useState(null);
  const [playerCountPerCountry, setPlayerCountPerCountry] = useState(null);
  const [markers, setMarkers] = useState(null);

  const fetchClubs = () => {
    console.log(user);
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

  useEffect(() => {
    if (clubs) {
      const markerPositions = [];

      clubs.map((club) => {
        if (club.geolocation?.latitude && club.geolocation?.longitude) {
          markerPositions.push({
            id: club.id,
            city: club.city,
            position: [club.geolocation.latitude, club.geolocation.longitude],
          });
        } else {
          console.log("lat/long not found for : " + club.id);
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
      {user ? (
        <MapContainer
          className="bg-dark h-100 w-100"
          center={
            user?.geolocation?.latitude && user?.geolocation?.longitude
              ? [user.geolocation.latitude, user.geolocation.longitude]
              : [49.8152995, 6.13332]
          }
          zoom={4}
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
                  color="rgba(13, 202, 240, .6)"
                  fillColor="#0dcaf0"
                  fillOpacity={0.3}
                >
                  <Popup>
                    <strong>{key.replace("_", " ")}</strong> <br />
                    Player(s): {count}
                  </Popup>
                </CircleMarker>
              );
            })}

          {user?.geolocation?.latitude &&
            user?.geolocation?.longitude &&
            (() => {
              const markerIcon = L.divIcon({
                html: `
                <div style="position: relative; text-align: center; background-color: rgba(0,0,0,0);">
                  <!-- Building Icon -->
                  <i class="bi bi-house-fill" style="position: absolute; color: #0dcaf0; font-size: 30px; left: 50%; transform: translateX(-50%)"></i>

                  <!-- City name centered below the building image -->
                  <div style="position: absolute; top: 38px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: bold; color: rgb(173, 181, 189); white-space: nowrap;">
                    ${user.geolocation.city || "Unknown City"}
                  </div>
                </div>
              `,
                iconSize: [20, 40],
                iconAnchor: [10, 40],
                popupAnchor: [0, -40],
              });

              return (
                <Marker
                  key="user-location"
                  icon={markerIcon}
                  position={[
                    user.geolocation.latitude,
                    user.geolocation.longitude,
                  ]}
                >
                  <Popup>
                    {user.geolocation.city ? `${user.geolocation.city}, ` : ""}
                    {user.geolocation.country || "Unknown Country"}
                  </Popup>
                </Marker>
              );
            })()}
        </MapContainer>
      ) : (
        <LoadingSquare />
      )}
    </div>
  );
};

export default PageUserMap;
