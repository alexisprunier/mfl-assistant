import React from 'react';
import { Link } from 'react-router-dom';

interface BoxNotificationCenterProps {
}

const BoxNotificationCenter: React.FC<BoxNotificationCenterProps> = () => {
  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
				<Link to="/notification" className="text-decoration-none text-center">
	        <div className="card h-100 d-flex align-items-center justify-content-center">
	          <div className="flex-column">
	          	<i className="bi bi-alarm-fill display-1"></i>
	            <h4 className="card-title">Open the notification center</h4>
	          </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BoxNotificationCenter;