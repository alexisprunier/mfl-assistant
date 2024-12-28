import React from "react";
import "./MenuPageUser.css";
import { Link, useLocation } from "react-router-dom";
import LoadingSquare from "components/loading/LoadingSquare.js";
import * as fcl from "@onflow/fcl";

interface MenuPageUserProps {
  user: object;
  assistantUser: object;
}

const MenuPageUser: React.FC<MenuPageUserProps> = (props) => {
  const location = useLocation();

  const logOut = () => {
    fcl.unauthenticate();
    props.logout();
  };

  return (
    <div>
      <div id="MenuPageUser" className="navbar d-md-none w-100 ps-5 p-2 pb-0">
        <Link className={"nav-link nav-user border rounded-2 px-2"}>
          <i className="bi bi-person-fill me-1"></i>
          <span className="d-none d-md-inline ms-1">
            {props.user?.name ? props.user.name : <LoadingSquare />}
          </span>
        </Link>
      </div>

      <nav
        id="MenuPageUser"
        className="navbar justify-content-center justify-content-md-start w-100 ps-md-5 p-2"
      >
        <ul className="navbar-nav flex-row h6 ps-md-3">
          <li className="nav-item align-self-end lh-1 px-2 d-md-block d-none">
            <Link className={"nav-link nav-user border rounded-2 px-3"}>
              <i className="bi bi-person-fill me-1"></i>
              <span className="d-none d-md-inline ms-1">
                {props.user?.name ? props.user.name : <LoadingSquare />}
              </span>
            </Link>
          </li>
          <li className="nav-item align-self-end lh-1 px-2">
            <Link
              to="players"
              className={
                "nav-link" +
                (location.pathname.startsWith("/user/") &&
                !location.pathname.includes("/clubs") &&
                !location.pathname.includes("/map")
                  ? " active"
                  : "")
              }
            >
              <i className="bi bi-person-badge-fill mx-1"></i>
              <span className="d-none d-md-inline ms-1">Players</span>
            </Link>
          </li>
          <li className="nav-item align-self-end lh-1 px-2">
            <Link
              to="clubs"
              className={
                "nav-link" +
                (location.pathname.startsWith("/user/") &&
                location.pathname.includes("/clubs")
                  ? " active"
                  : "")
              }
            >
              <i className="bi bi-buildings-fill mx-1"></i>
              <span className="d-none d-md-inline ms-1">Clubs</span>
            </Link>
          </li>
          <li className="nav-item align-self-end lh-1 px-2">
            <Link
              to="map"
              className={
                "nav-link" +
                (location.pathname.startsWith("/user/") &&
                location.pathname.includes("/map")
                  ? " active"
                  : "")
              }
            >
              <i className="bi bi-globe-americas mx-1"></i>
              <span className="d-none d-md-inline ms-1">Map</span>
            </Link>
          </li>
          {props.user?.address &&
            props.assistantUser?.address === props.user?.address && (
              <li className="nav-item align-self-end lh-1 px-2">
                <Link onClick={logOut} className={"nav-link"}>
                  <i className="bi bi-box-arrow-right text-danger mx-1"></i>
                  <span className="d-none d-md-inline text-danger ms-1">
                    Log out
                  </span>
                </Link>
              </li>
            )}
        </ul>
      </nav>
    </div>
  );
};

export default MenuPageUser;
