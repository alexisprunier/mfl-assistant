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
import {
  getClubCountPerGeolocation,
  getUserCountPerGeolocation,
} from "services/api-assistant.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupClubListPerGeography from "components/popups/PopupClubListPerGeography.js";
import PopupUserListPerGeography from "components/popups/PopupUserListPerGeography.js";
import { countries } from "utils/geography.js";

const MAX_MARKERS = 50;

const PageMap: React.FC = () => {
  const [counts, setCounts] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const mapRef = useRef(null);

  const [mapType, setMapType] = useState("clubs");
  const [mapGeographic, setMapGeographic] = useState("city");

  const [isClubPopupOpen, setIsClubPopupOpen] = useState(false);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [includeMfl, setIncludeMfl] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);

    if (mapType === "clubs") {
      getClubCountPerGeolocation({
        handleSuccess: (d) => {
          setCounts(d.data.getClubCountPerGeolocation);
          setIsLoading(false);
        },
        handleError: (e) => console.log(e),
        params: { includeMfl: includeMfl, geographic: mapGeographic },
      });
    } else {
      getUserCountPerGeolocation({
        handleSuccess: (d) => {
          setCounts(d.data.getUserCountPerGeolocation);
          setIsLoading(false);
        },
        handleError: (e) => console.log(e),
        params: { hasClub: true, geographic: mapGeographic },
      });
    }
  }, [mapGeographic, mapType, includeMfl]);

  useEffect(() => {
    fetchData();
  }, [fetchData, mapType, mapGeographic, includeMfl]);

  const markerPositions = useMemo(() => {
    if (counts) {
      return counts.map((count, i) => ({
        id:
          mapGeographic === "city"
            ? `${count.geolocation.country}, ${count.geolocation.city}`
            : `${count.geolocation.country}`,
        label:
          mapGeographic === "city"
            ? count.geolocation.city
            : count.geolocation.country,
        count: count.count,
        position:
          mapGeographic === "city"
            ? [count.geolocation.latitude, count.geolocation.longitude]
            : countries[count.geolocation.country],
        country: count.geolocation.country,
        city: mapGeographic === "city" ? count.geolocation.city : null,
      }));
    }
    return [];
  }, [counts, countries]);

  useEffect(() => {
    setMarkers(markerPositions);
  }, [markerPositions]);

  const handleMoveEnd = useCallback(() => {
    if (mapRef.current && markers) {
      const map = mapRef.current;
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter(
        ({ position }) => position && bounds.contains(position)
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
      {markers === null || counts === null || isLoading ? (
        <LoadingSquare />
      ) : (
        <MapContainer
          className="bg-dark h-100 w-100"
          center={[49.61, 6.13]}
          zoom={4}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />

          <MapBoundsTracker />

          {filteredMarkers.map((c) => {
            const iconHtml =
              mapType === "clubs"
                ? `<i class="bi bi-buildings-fill" style="font-size: 26px; color: #0dcaf0;"></i>`
                : `<i class="bi bi-person-fill" style="font-size: 30px; color: #0dcaf0;"></i>`;

            const markerIcon = L.divIcon({
              html: `
              <div style="position: relative; text-align: center; background-color: rgba(0,0,0,0);">
                <!-- Building Icon -->
                ${iconHtml}

                <!-- Number on the left middle of the building image -->
                <span style="position: absolute; top: ${
                  mapType === "clubs" ? "25px" : "28px"
                }; right: ${
                mapType === "clubs" ? "24px" : "21px"
              }; transform: translateY(-50%); font-size: 14px; font-weight: bold; color: #0dcaf0;">
                  ${c.count}
                </span>

                <!-- City name centered below the building image, no word wrapping -->
                <div style="position: absolute; bottom: ${
                  mapType === "clubs" ? "-12px" : "-9px"
                }; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: bold; color: rgb(173, 181, 189); white-space: nowrap;">
                  ${c.label}
                </div>
              </div>
        `,
              iconSize: [20, 40],
              iconAnchor: [10, 40],
              popupAnchor: [0, -40],
            });

            return (
              <Marker
                key={c.id}
                icon={markerIcon}
                position={c.position}
                eventHandlers={{
                  click: () => {
                    setSelectedCountry(c.country);
                    setSelectedCity(c.city);
                    if (mapType === "users") {
                      setIsUserPopupOpen(true);
                    } else {
                      setIsClubPopupOpen(true);
                    }
                  },
                }}
              ></Marker>
            );
          })}
        </MapContainer>
      )}

      <div className="map-selector position-absolute d-flex flex-column align-items-end">
        <div className="map-select d-flex flex-row ms-md-2 border rounded-2 mb-1">
          <button
            className={
              "d-flex flex-grow-1 btn btn-small" +
              (mapType === "clubs" ? " btn-info text-white" : " text-info")
            }
            disabled={isLoading}
            onClick={() => setMapType("clubs")}
          >
            Clubs
          </button>
          <button
            className={
              "d-flex flex-grow-1 btn btn-small" +
              (mapType === "users" ? " btn-info text-white" : " text-info")
            }
            disabled={isLoading}
            onClick={() => setMapType("users")}
          >
            Users
          </button>
        </div>

        <div className="map-select d-flex flex-row ms-md-2 border rounded-2">
          <button
            className={
              "d-flex flex-grow-1 btn btn-small" +
              (mapGeographic === "city" ? " btn-info text-white" : " text-info")
            }
            disabled={isLoading}
            onClick={() => setMapGeographic("city")}
          >
            City
          </button>
          <button
            className={
              "d-flex flex-grow-1 btn btn-small" +
              (mapGeographic === "country"
                ? " btn-info text-white"
                : " text-info")
            }
            disabled={isLoading}
            onClick={() => setMapGeographic("country")}
          >
            Country
          </button>
        </div>

        {mapType === "clubs" ? (
          <>
            <div className="mt-1">
              <small>
                Include MFL licenses
                <input
                  type="checkbox"
                  className="ms-1"
                  checked={includeMfl}
                  onChange={(p) => setIncludeMfl(!includeMfl)}
                />
              </small>
            </div>
          </>
        ) : (
          <div class="small mt-1">Users owning a club*</div>
        )}
      </div>

      <PopupClubListPerGeography
        open={isClubPopupOpen}
        country={selectedCountry}
        city={selectedCity}
        includeMfl={includeMfl}
        onClose={() => {
          setIsClubPopupOpen(false);
          setSelectedCountry(null);
          setSelectedCity(null);
        }}
      />

      <PopupUserListPerGeography
        open={isUserPopupOpen}
        country={selectedCountry}
        city={selectedCity}
        onClose={() => {
          setIsUserPopupOpen(false);
          setSelectedCountry(null);
          setSelectedCity(null);
        }}
      />
    </div>
  );
};

export default PageMap;
