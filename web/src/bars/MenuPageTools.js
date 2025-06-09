import React from "react";
import "./MenuPageTools.css";
import { Link, useLocation } from "react-router-dom";

interface MenuPageToolsProps {}

const MenuPageTools: React.FC<MenuPageToolsProps> = (props) => {
  const location = useLocation();

  return (
    <nav
      id="MenuPageTools"
      className="navbar justify-content-center justify-content-md-start w-100 ps-md-5 p-2"
    >
      <ul className="navbar-nav flex-row h6 ps-md-3">
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="player-pricing"
            className={
              "nav-link" +
              (["/tools/player-pricing"].indexOf(location.pathname) >= 0
                ? " active"
                : "")
            }
          >
            <i className="bi bi-currency-exchange mx-1"></i>
            <span className="d-none d-md-inline ms-1">Player pricing</span>
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="contract-evaluation"
            className={
              "nav-link" +
              (location.pathname === "/tools/contract-evaluation"
                ? " active"
                : "")
            }
          >
            <i className="bi bi bi-journal-bookmark-fill mx-1"></i>
            <span className="d-none d-md-inline ms-1">Contract evaluation</span>
          </Link>
        </li>
        <li className="nav-item align-self-end lh-1 px-2">
          <Link
            to="team-builder"
            className={
              "nav-link" +
              (location.pathname === "/tools/team-builder" ? " active" : "")
            }
          >
            <i className="bi bi-clipboard2-check-fill mx-1"></i>
            <span className="d-none d-md-inline ms-1">Team builder</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuPageTools;
