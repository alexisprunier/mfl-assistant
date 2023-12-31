import React from 'react';
import "./MenuPageDash.css";
import { Link, useLocation } from 'react-router-dom';

interface MenuPageDashProps {}

const MenuPageDash: React.FC<MenuPageDashProps> = (props) => {
  const location = useLocation();

  return (
    <nav id="MenuPageDash" className="navbar justify-content-center w-100 p-2">
      <ul className="navbar-nav flex-row h6">
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="players"
            className={"nav-link"
              + (["/dash", "/dash/", "/dash/players"].indexOf(location.pathname) >= 0 ? " active" : "")}
          >
            Players
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="clubs"
            className={"nav-link" + (location.pathname === "/dash/clubs" ? " active" : "")}
          >
            Clubs
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="competitions"
            className={"nav-link" + (location.pathname === "/dash/competitions" ? " active" : "")}
          >
            Competitions
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default MenuPageDash;
