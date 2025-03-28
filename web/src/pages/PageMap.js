import L from "leaflet";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "statics/leaflet.css";
import "./PageMap.css";
import { getClubCountPerGeolocation } from "services/api-assistant.js";
import LoadingSquare from "components/loading/LoadingSquare.js";

const MAX_MARKERS = 50; // Set max markers limit

const PageMap: React.FC = () => {
  const [clubCount, setClubCount] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const mapRef = useRef(null);

  const fetchClubCountPerGeolocation = useCallback(() => {
    getClubCountPerGeolocation({
      handleSuccess: (d) => setClubCount(d.data.getClubCountPerGeolocation),
      handleError: (e) => console.log(e),
      params: { foundedOnly: false },
    });
  }, []);

  useEffect(() => {
    fetchClubCountPerGeolocation();
  }, [fetchClubCountPerGeolocation]);

  const markerPositions = useMemo(() => {
    if (clubCount) {
      return clubCount.map((count, i) => ({
        id: `${count.geolocation.country}, ${count.geolocation.city}`,
        city: count.geolocation.city,
        count: count.count,
        position: [count.geolocation.latitude, count.geolocation.longitude],
      }));
    }
    return [];
  }, [clubCount]);

  useEffect(() => {
    setMarkers(markerPositions);
  }, [markerPositions]);

  const handleMoveEnd = useCallback(() => {
    if (mapRef.current && markers) {
      const map = mapRef.current;
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter(({ position }) =>
        bounds.contains(position)
      );

      setFilteredMarkers((prevMarkers) => {
        if (
          JSON.stringify(prevMarkers) !==
          JSON.stringify(visibleMarkers.slice(0, MAX_MARKERS))
        ) {
          return visibleMarkers.slice(0, MAX_MARKERS);
        }
        return prevMarkers;
      });
    }
  }, [markers]);

  const MapBoundsTracker = () => {
    const map = useMapEvents({
      moveend: handleMoveEnd,
    });

    useEffect(() => {
      mapRef.current = map;
      if (markers) {
        handleMoveEnd();
      }
    }, [markers, handleMoveEnd]);

    return null;
  };

  return (
    <div id="PageMap" className="position-relative w-100 h-100">
      {markers === null || clubCount === null ? (
        <LoadingSquare />
      ) : (
        <MapContainer
          className="bg-dark h-100 w-100"
          center={[49.61, 6.13]}
          zoom={3}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />

          <MapBoundsTracker />

          {filteredMarkers.map((c) => {
            const markerIcon = L.divIcon({
              html: `
              <div style="position: relative; text-align: center; background-color: rgba(0,0,0,0);">
                <!-- Building Icon -->
                <img src="/media/images/buildings-blue.svg" width="20" height="20" />

                <!-- Number on the left middle of the building image -->
                <span style="position: absolute; top: 60%; left: -12px; transform: translateY(-50%); font-size: 14px; font-weight: bold; color: #0dcaf0;">
                  ${c.count}
                </span>

                <!-- City name centered below the building image, no word wrapping -->
                <div style="position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: bold; color: rgb(173, 181, 189); white-space: nowrap;">
                  ${c.city}
                </div>
              </div>
            `,
              iconSize: [20, 40],
              iconAnchor: [10, 40],
              popupAnchor: [0, -40],
            });

            return (
              <Marker key={c.id} icon={markerIcon} position={c.position}>
                <Popup>{c.city}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default PageMap;