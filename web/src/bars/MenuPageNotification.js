import React from 'react';
import "./MenuPageNotification.css";
import { Link, useLocation } from 'react-router-dom';
import LoadingSquare from "components/loading/LoadingSquare.js";
import Popup from "reactjs-popup";
import * as fcl from "@onflow/fcl";

interface MenuPageNotificationProps {
  user: object;
  assistantUser: object;
}

const MenuPageNotification: React.FC < MenuPageNotificationProps > = (props) => {
  const location = useLocation();

  const logOut = () => {
    fcl.unauthenticate();
    props.logout();
  };

  return (
    <div>
      <nav id="MenuPageNotification" className="navbar justify-content-center justify-content-md-start w-100 ps-md-5 p-2">
        <ul className="navbar-nav flex-row h6 ps-md-3">
          <li className="nav-item align-self-end lh-1 px-2">
            <Link
              to="marketplace"
              className={"nav-link"
                + (["/notification", "/notification/", "/notification/marketplace"].indexOf(location.pathname) >= 0 ? " active" : "")}
            >
              <i className="bi bi-shop mx-1"></i>
              <span className="d-none d-md-inline ms-1">Marketplace</span>
            </Link>
          </li>

          <li className="nav-item align-self-end lh-1 px-2">
            <Link
              to="report"
              className={"nav-link"
                + (location.pathname === "/notification/report" ? " active" : "")}
            >
              <i class="bi bi-calendar3 mx-1"></i>
              <span className="d-none d-md-inline ms-1">Daily report</span>
            </Link>
          </li>

          <Popup
            trigger={
              <li className="nav-item align-self-end lh-1 px-2">
                <Link className={"nav-link"}>
                  <i class="bi bi-envelope-at text-info mx-1"></i>
                  <span className="d-none d-md-inline text-info ms-1">Manage email</span>
                </Link>
              </li>
            }
            modal
            closeOnDocumentClick
            className={"fade-in popup-md"}
          >
            {(close) => (
              <div className="container bg-dark border border-info border-3 rounded-3 p-4">
                <div className="d-flex flex-row mb-2">
                  <div className="flex-grow-1">
                    <h2 className="text-white">
                      Manage email
                    </h2>
                  </div>
                  <div className="flex-grow-0">
                    <button
                      className={"btn"}
                      onClick={close}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-column">
                  <input
                    type="text"
                    className="form-control w-100 mb-2"
                    value={props.assistantUser.email}
                    disabled={true}
                    autoFocus
                  />
                  <div className="d-flex justify-content-end">
                    <button
                      className="d-block btn btn-danger btn-sm text-white mb-1"
                      onClick={() => props.updateAssistantUser(null)}
                    >
                      <i className="bi bi-trash3"></i> Delete email
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Popup>
        </ul>
      </nav>
    </div>
  );
}

export default MenuPageNotification;