import React from 'react';
import "./MenuPageDash.css";
import { Link, useLocation } from 'react-router-dom';

interface MenuPageDashProps {}

const MenuPageDash: React.FC<MenuPageDashProps> = (props) => {
  const location = useLocation();

  return (
    <nav id="MenuPageDash" className="navbar justify-content-center justify-content-md-start w-100 ps-md-5 p-2">
      <ul className="navbar-nav flex-row h6 ps-md-3">
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="players"
            className={"nav-link"
              + (["/dash", "/dash/", "/dash/players"].indexOf(location.pathname) >= 0 ? " active" : "")}
          >
            <i className="bi bi-person-badge mx-1"></i>
            <span className="d-none d-md-inline ms-1">Players</span>
          </Link>
        </li>
        {/* <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="clubs"
            className={"nav-link" + (location.pathname === "/dash/clubs" ? " active" : "")}
          >
            <i className="bi bi-buildings mx-1"></i>
            <span className="d-none d-md-inline ms-1">Clubs</span>
          </Link>
        </li> */}
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="competitions"
            className={"nav-link" + (location.pathname === "/dash/competitions" ? " active" : "")}
          >
            <i className="bi bi-diagram-3-fill mx-1"></i>
            <span className="d-none d-md-inline ms-1">Competitions</span>
          </Link>
        </li>
        {/* <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="map"
            className={"nav-link" + (location.pathname === "/dash/map" ? " active" : "")}
          >
            <i className="bi bi-globe-americas mx-1"></i>
            <span className="d-none d-md-inline ms-1">Map</span>
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default MenuPageDash;
