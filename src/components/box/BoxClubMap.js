import React from 'react';
import { Link } from 'react-router-dom';

interface BoxClubMapProps {
}

const BoxClubMap: React.FC<BoxClubMapProps> = () => {
  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
				<Link to="/map" className="text-decoration-none text-center">
	        <div className="card h-100 d-flex align-items-center justify-content-center">
	          <div className="flex-column">
	          	<i class="bi bi-globe-central-south-asia display-1"></i>
	            <h4 className="card-title">Open the map</h4>
	          </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BoxClubMap;