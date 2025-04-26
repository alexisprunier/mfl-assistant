import React from "react";
import "./Menu.css";
import { Link, useLocation } from "react-router-dom";
import ButtonLogin from "components/buttons/ButtonLogin.js";

interface MenuProps {}

const Menu: React.FC<MenuProps> = (props) => {
  const location = useLocation();

  const getMenuLabel = (text, cl) => {
    return (
      <span
        className={
          "text-center text-capitalize w-100 " +
          "lh-1 py-0 py-lg-3 pt-lg-1 pb-lg-2 px-1 px-lg-0 " +
          cl
        }
      >
        {text}
      </span>
    );
  };

  return (
    <nav id="Menu" className="navbar h-100 flex-lg-column px-3 py-2">
      {!location.pathname.startsWith("/search") &&
        location.pathname !== "/" && (
          <Link to="/search" className={"nav-link nav-link-search py-2 px-3"}>
            <div className="py-lg-1 px-lg-1">
              <i className="bi bi-search"></i>
            </div>
          </Link>
        )}

      <div className="d-flex flex-grow-0 align-items-center">
        <img
          width="auto"
          className="mt-lg-2 me-1 me-lg-0"
          style={{ maxWidth: "32px" }}
          src="/media/images/assistant.png"
          alt="MFL Assistant"
        />
      </div>

      <div className="d-flex flex-grow-1 align-items-lg-center">
        <ul className="navbar-nav flex-row flex-lg-column h4">
          <li className="nav-item">
            <Link
              to="/"
              className={
                "nav-link" + (location.pathname === "/" ? " active" : "")
              }
            >
              {location.pathname === "/" &&
                getMenuLabel("Home", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0 order-2 order-lg-1">
                {location.pathname === "/" ? (
                  <i className="bi bi-house-fill"></i>
                ) : (
                  <i className="bi bi-house"></i>
                )}
              </div>
              {/*location.pathname === "/" &&
                getMenuLabel("", "d-inline d-lg-none")*/}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dash"
              className={
                "nav-link" +
                (location.pathname.startsWith("/dash") ? " active" : "")
              }
            >
              {location.pathname.startsWith("/dash") &&
                getMenuLabel("Dashboard", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/dash") ? (
                  <i className="bi bi-graph-up-arrow"></i>
                ) : (
                  <i className="bi bi-graph-up"></i>
                )}
              </div>
              {location.pathname.startsWith("/dash") &&
                getMenuLabel("Dash", "d-inline d-lg-none")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/tools"
              className={
                "nav-link" +
                (location.pathname.startsWith("/tools") ? " active" : "")
              }
            >
              {location.pathname.startsWith("/tools") &&
                getMenuLabel("Tools", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/tools") ? (
                  <i className="bi bi-wrench-adjustable"></i>
                ) : (
                  <i className="bi bi-wrench-adjustable"></i>
                )}
              </div>
              {location.pathname.startsWith("/tools") &&
                getMenuLabel("Tools", "d-inline d-lg-none")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/notification"
              className={
                "nav-link" +
                (location.pathname.startsWith("/notification") ? " active" : "")
              }
            >
              {location.pathname.startsWith("/notification") &&
                getMenuLabel("Notification", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/notification") ? (
                  <i className="bi bi-alarm-fill"></i>
                ) : (
                  <i className="bi bi-alarm"></i>
                )}
              </div>
              {location.pathname.startsWith("/notification") &&
                getMenuLabel("Notif.", "d-inline d-lg-none")}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/map"
              className={
                "nav-link" +
                (location.pathname.startsWith("/map") ? " active" : "")
              }
            >
              {location.pathname.startsWith("/map") &&
                getMenuLabel("Map", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/map") ? (
                  <i className="bi bi-globe-asia-australia"></i>
                ) : (
                  <i className="bi bi-globe-americas"></i>
                )}
              </div>
              {location.pathname.startsWith("/map") &&
                getMenuLabel("Map", "d-inline d-lg-none")}
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-grow-0">
        <div className="nav-item align-content-center">
          <ButtonLogin
            className={"nav-link nav-link-login ps-2 ps-lg-0 ms-lg-0"}
            flowUser={props.flowUser}
            assistantUser={props.assistantUser}
            logout={props.logout}
            redirectToHq={true}
            content={
              <div
                className="Menu-login d-inline-block align-items-center text-center"
                title="Login"
              >
                <div className="text-center">
                  <i className="bi bi-person lh-1 px-1"></i>
                  <div className="d-block w-100 lh-1">LOGIN</div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </nav>
  );
};

export default Menu;
