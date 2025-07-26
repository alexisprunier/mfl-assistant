import React from "react";
import "./MenuPageDash.css";
import { Link, useLocation } from "react-router-dom";

interface MenuPageDashProps {}

const MenuPageDash: React.FC<MenuPageDashProps> = (props) => {
  const location = useLocation();

  return (
    <nav id="MenuPageDash" className="navbar justify-content-center justify-content-md-start w-100 ps-md-5 p-2">
      <ul className="navbar-nav flex-row h6 ps-md-3">
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="general"
            className={"nav-link" + (["/dash/general"].indexOf(location.pathname) >= 0 ? " active" : "")}
          >
            <i className="bi bi-activity mx-1"></i>
            <span className="d-none d-md-inline ms-1">General</span>
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link to="players" className={"nav-link" + (location.pathname === "/dash/players" ? " active" : "")}>
            <i className="bi bi-person-badge mx-1"></i>
            <span className="d-none d-md-inline ms-1">Players</span>
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link to="clubs" className={"nav-link" + (location.pathname === "/dash/clubs" ? " active" : "")}>
            <i className="bi bi-buildings mx-1"></i>
            <span className="d-none d-md-inline ms-1">Clubs</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuPageDash;
