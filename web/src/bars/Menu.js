import React from 'react';
import "./Menu.css";
import { Link, useLocation } from 'react-router-dom';
import ButtonLogin from "components/buttons/ButtonLogin.js";

interface MenuProps {}

const Menu: React.FC < MenuProps > = (props) => {
  const location = useLocation();

  const getMenuLabel = (text, cl) => {
    return <span
      className={
        "text-center text-capitalize w-100 " +
        "lh-1 py-0 py-md-3 pt-md-1 pb-md-2 px-1 px-md-0 "
        + cl
      }
    >
      {text}
    </span>
  }

  return (
    <nav id="Menu" className="navbar h-100 flex-md-column px-3 py-2">
      {!location.pathname.startsWith("/search")
        && <Link
          to="/search"
          className={"nav-link nav-link-search py-2 px-3"}
        >
          <div className="py-md-1 px-md-1">
            <i className="bi bi-search"></i>
          </div>
        </Link>
      }

      <div className="d-flex flex-grow-1 align-items-md-center">
        <ul className="navbar-nav flex-row flex-md-column h4">
          <li className="nav-item">
            <Link
              to="/"
              className={"nav-link" + (location.pathname === "/" ? " active" : "")}
            >
              {location.pathname === "/"
                && getMenuLabel("Home", "d-none d-md-inline")
              }
              <div className="px-2 px-md-0 order-2 order-md-1">
                {location.pathname === "/"
                  ? <i className="bi bi-house-fill"></i>
                  : <i className="bi bi-house"></i>
                }
              </div>
              {location.pathname === "/"
                && getMenuLabel("Home", "d-inline d-md-none")
              }
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/dash"
              className={"nav-link" + (location.pathname.startsWith("/dash") ? " active" : "")}
            >
              {location.pathname.startsWith("/dash")
                && getMenuLabel("Dashboard", "d-none d-md-inline")
              }
              <div className="px-2 px-md-0">
                {location.pathname.startsWith("/dash")
                  ? <i className="bi bi-clipboard-data-fill"></i>
                  : <i className="bi bi-clipboard-data"></i>

                }
              </div>
              {location.pathname.startsWith("/dash")
                && getMenuLabel("Dashboard", "d-inline d-md-none")
              }
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/tools"
              className={"nav-link" + (location.pathname.startsWith("/tools") ? " active" : "")}
            >
              {location.pathname.startsWith("/tools")
                && getMenuLabel("Tools", "d-none d-md-inline")
              }
              <div className="px-2 px-md-0">
                {location.pathname.startsWith("/tools")
                  ? <i className="bi bi-wrench-adjustable-circle-fill"></i>
                  : <i className="bi bi-wrench-adjustable-circle"></i>
                }
              </div>
              {location.pathname.startsWith("/tools")
                && getMenuLabel("Tools", "d-inline d-md-none")
              }
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/notification"
              className={"nav-link" + (location.pathname.startsWith("/notification") ? " active" : "")}
            >
              {location.pathname.startsWith("/notification")
                && getMenuLabel("Notification", "d-none d-md-inline")
              }
              <div className="px-2 px-md-0">
                {location.pathname.startsWith("/notification")
                  ? <i className="bi bi-alarm-fill"></i>
                  : <i className="bi bi-alarm"></i>
                }
              </div>
              {location.pathname.startsWith("/notification")
                && getMenuLabel("Notification", "d-inline d-md-none")
              }
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-grow-0">
        <div className="nav-item align-content-center">
          <ButtonLogin
            className={"nav-link nav-link-login ps-2 ps-md-0 ms-md-0"}
            flowUser={props.flowUser}
            assistantUser={props.assistantUser}
            logout={props.logout}
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;