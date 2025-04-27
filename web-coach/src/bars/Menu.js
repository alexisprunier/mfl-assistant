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
      <div className="d-flex flex-grow-0 align-items-center">
        <img
          width="auto"
          className="mt-lg-2 me-1 me-lg-0"
          style={{ maxWidth: "32px" }}
          src="/media/images/coach.png"
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
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/match-analysis"
              className={
                "nav-link" +
                (location.pathname.startsWith("/match-analysis")
                  ? " active"
                  : "")
              }
            >
              {location.pathname.startsWith("/match-analysis") &&
                getMenuLabel("Match analysis", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/match-analysis") ? (
                  <i className="bi bi-clipboard-data-fill"></i>
                ) : (
                  <i className="bi bi-clipboard-data"></i>
                )}
              </div>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/formation-meta"
              className={
                "nav-link" +
                (location.pathname.startsWith("/formation-meta")
                  ? " active"
                  : "")
              }
            >
              {location.pathname.startsWith("/formation-meta") &&
                getMenuLabel("Formation meta", "d-none d-lg-inline")}
              <div className="px-2 px-lg-0">
                {location.pathname.startsWith("/formation-meta") ? (
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                ) : (
                  <i className="bi bi-grid-3x3-gap"></i>
                )}
              </div>
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
