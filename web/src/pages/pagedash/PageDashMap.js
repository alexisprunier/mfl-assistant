import React, { useState, useEffect } from 'react';
import "./PageDashMap.css";
import "statics/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import FilterClub from "components/filters/FilterClub.js";

interface PageDashMapProps {}

const PageDashMap: React.FC<PageDashMapProps> = () => {
  const [clubs, setClubs] = useState(null);
  const [filters, setFilters] = useState({ divisions: [1] });

  var markerIcon = L.icon({
    iconUrl: "/media/images/buildings-blue.svg",
    iconSize: [20, 20]
  });

  useEffect(() => {
    fetch('/data/mfl_clubs.json')
      .then(response => response.json())
      .then(data => {
        setClubs(data);
      });
  }, []);

  return (
    <div id="PageDashMap" className="position-relative w-100 h-100">
      <div className="FilterClub-wrapper position-absolute top-0 end-0 m-4">
        <FilterClub
          filters={filters}
          onChange={(f) => setFilters(f)}
          showDivisions={true}
        />
      </div>

      <div className="Warning-wrapper position-absolute w-auto fixed-bottom my-4 mx-4 mx-md-5">
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="bi bi-cone-striped me-2"></i>The input data is a snapshot prior to the issuance of the stone clubs
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>

      <MapContainer className="bg-dark h-100 w-100" center={[49.61, 6.13]} zoom={3}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        {clubs &&
          clubs
            .filter((c) => filters.divisions.indexOf(c.division) > -1)
            .map((c) => (
              <Marker
                key={c.id}
                icon={markerIcon}
                position={[c.lat, c.lng]}>
                <Popup>
                  {c.city}
                </Popup>
              </Marker>
            ))
        }
      </MapContainer>
    </div>
  );
};

export default PageDashMap;