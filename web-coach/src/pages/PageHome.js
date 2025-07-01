import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageHome.css";

interface PageHomeProps {
  props: object;
  flowUser: Object;
  assistantUser: Object;
  updateAssistantUser: Object;
  logout: Object;
  yScrollPosition: number;
}

const PageHome: React.FC<PageHomeProps> = ({
  props,
  flowUser,
  assistantUser,
  updateAssistantUser,
  logout,
  yScrollPosition,
}) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchValue.length >= 2) {
        navigate("/search?q=" + searchValue);
      }
    }
  };

  return (
    <div id="PageHome" className="h-100">
      <div className="h-100 w-100">
        <div className="d-flex h-100 w-100 flex-column flex-lg-row flex-nowrap">
          <div
            className="d-flex flex-column flex-grow-1 flex-basis-50p h-100 pb-lg-3"
            style={{ minWidth: "0" }}
          >
            <div className="d-flex flex-column flex-fill">
              <div
                className="searchBar d-flex py-2 px-2"
                style={{ borderBottomRightRadius: "10px" }}
              >
                <div className="d-flex flex-grow-1 pe-2">
                  <input
                    type="text"
                    className="form-control w-100"
                    value={searchValue}
                    onChange={(v) => setSearchValue(v.target.value)}
                    placeholder={"Search players, clubs, users..."}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="d-flex flex-grow-0">
                  <button
                    type="text"
                    className="btn btn-link w-100 me-2 me-lg-0"
                    onClick={() => navigate("/search?q=" + searchValue)}
                    disabled={searchValue.length < 2}
                  >
                    <i className="bi bi-search text-white"></i>
                  </button>
                </div>
              </div>

              <div className="main-view d-flex flex-row flex-grow-1 justify-content-center">
                <div className="d-flex flex-column align-self-center position-relative">
                  <img
                    width="auto"
                    style={{ maxWidth: "300px" }}
                    src="/media/images/coach.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center">
                    <a
                      href="https://www.buymeacoffee.com/mflassistant"
                      target="_blank"
                    >
                      <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=mflassistant&button_colour=f9819d&font_colour=FFFFFF&font_family=Bree&outline_colour=000000&coffee_colour=FFDD00" />
                    </a>
                  </div>

                  <div className="media-mfl">
                    <a
                      className="h4"
                      target="_blank"
                      href="https://app.playmfl.com/users/0xdf26376de6cba19e"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 55.541065 17.780001"
                        height="14"
                        version="1.1"
                        className="NavMobile_logo__ws_KV"
                      >
                        <g transform="translate(227.49086,-63.017615)">
                          <path
                            fill="#f9819d"
                            d="m -202.64966,63.017615 -3.5052,17.78 h -5.461 l 1.5748,-8.1026 -5.0038,6.5024 h -2.6416 l -2.7432,-6.4008 -1.6002,8.001 h -5.461 l 3.556,-17.78 h 4.8768 l 3.8608,9.4488 7.4422,-9.4488 z"
                          ></path>
                          <path
                            fill="#f9819d"
                            d="m -194.64548,67.538815 -0.6096,3.048 h 7.4168 l -0.9144,4.5212 h -7.3914 l -1.143,5.6896 h -5.9944 l 3.556,-17.78 h 14.4526 l -0.9144,4.5212 z"
                          ></path>
                          <path
                            fill="#f9819d"
                            d="m -183.35439,63.017615 h 5.9944 l -2.6162,13.1318 h 8.0264 l -0.9398,4.6482 h -14.0208 z"
                          ></path>
                        </g>
                      </svg>
                    </a>
                  </div>

                  <div className="media-discord">
                    <a
                      className="h4"
                      target="_blank"
                      href="https://discord.com/users/_alexisp."
                      rel="noreferrer"
                    >
                      <i
                        className="bi bi-discord"
                        style={{ color: "#f9819d" }}
                      ></i>
                    </a>
                  </div>

                  <div className="media-x">
                    <a
                      className="text-white h5 ms-1"
                      target="_blank"
                      href="https://twitter.com/Alexis_MFL"
                      rel="noreferrer"
                    >
                      <i
                        className="bi bi-twitter-x"
                        style={{ color: "#f9819d" }}
                      ></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="d-none d-sm-flex flex-row flex-row justify-content-center align-items-center mt-1 mb-2 px-3">
                <Link to="/opponent-finder">
                  <div className="d-flex flex-grow-0 card flex-column mx-1 px-4 py-2">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <i className="bi bi-binoculars h4"></i>
                        <br />
                        Opponent finder
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/formation-meta">
                  <div className="d-flex flex-grow-0 card flex-column mx-1 px-4 py-2">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <i className="bi bi-grid-3x3-gap h4"></i>
                        <br />
                        Formation meta
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/formation-meta">
                  <div className="d-flex flex-grow-0 card flex-column mx-1 px-4 py-2">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <i className="bi bi-clipboard2-check h4"></i>
                        <br />
                        Squad builder
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/match-analysis">
                  <div className="d-flex flex-grow-0 card flex-column mx-1 px-4 py-2">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="text-center">
                        <i className="bi bi-clipboard2-pulse h4"></i>
                        <br />
                        Match analysis
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHome;
