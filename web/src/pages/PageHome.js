import React, { useState, useEffect } from 'react';
import "./PageHome.css";
import { Link, useNavigate } from 'react-router-dom';
import BoxScrollDown from "components/box/BoxScrollDown.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";
import BoxSoonToCome from "components/box/BoxSoonToCome.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscHorizontalScroll from "components/misc/MiscHorizontalScroll.js";
import MiscFlag from "components/misc/MiscFlag.js";
import ItemCardSale from "components/items/ItemCardSale.js";
import ItemCardCommunityMember from "components/items/ItemCardCommunityMember.js";
import { getPlayerSales, getPlayerListings } from "services/api-mfl.js";

interface PageHomeProps {
  yScrollPosition: number;
}

const PageHome: React.FC < PageHomeProps > = ({ yScrollPosition }) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const [playerSales, setPlayerSales] = useState(null);
  const [playerListings, setPlayerListings] = useState(null);

  const contentCreators = [{
    name: "WenDirkCast",
    image: "https://pbs.twimg.com/profile_images/1699478704479461376/FpyRcFYv_400x400.jpg",
    link: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    countries: ["ENGLAND"],
  }, ];

  const tools = [{
    name: "MFL Player Info",
    link: "https://mflplayer.info/",
    countries: [],
  }, {
    name: "MFL Predictions",
    image: "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
    link: "https://mflmanager.fr/projections.html",
    countries: [],
  }];

  const initiatives = [{
    name: "MFL Manager",
    image: "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
    link: "https://discord.gg/GMuRDJsq",
    countries: ["FRANCE"],
    platforms: ["discord"]
  }, ];

  const clubSocials = [{
    name: "Sambre Hearts",
    image: "https://pbs.twimg.com/profile_images/1792928428770942976/H_WfZk8c_400x400.jpg",
    link: "https://x.com/SambreHearts",
    countries: ["ENGLAND"],
    platforms: ["twitter"]
  }, ];

  const getPlayerSalesData = () => {
    getPlayerSales({
      handleSuccess: (v) => {
        setPlayerSales(v);
      },
      handleError: (e) => {
        console.log(e);
      },
      params: {}
    });
  }

  const getPlayerListingData = () => {
    getPlayerListings({
      handleSuccess: (v) => {
        setPlayerListings(v);
      },
      handleError: (e) => {
        console.log(e);
      },
      params: {}
    });
  }

  useEffect(() => {
    getPlayerSalesData();
    getPlayerListingData();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchValue.length >= 2) {
        navigate('/search?q=' + searchValue);
      }
    }
  };

  return (
    <div id="PageHome" className="h-100">
      {window.innerWidth < 768 && yScrollPosition < 100
        && <BoxScrollDown />
      }

      {window.innerWidth < 768 && yScrollPosition >= 100
        && <BoxScrollUp />
      }

      <div className="h-md-100 w-100">
        <div className="d-flex h-md-100 w-100 flex-column flex-md-row flex-nowrap">
          <div className="d-flex flex-column flex-md-grow-1 flex-md-basis-50p h-100 pe-md-3 pb-md-3" style={{ minWidth: "0" }}>
            <div className="searchBar d-flex py-2 px-md-2" style={{ borderBottomRightRadius: "10px" }}>
              <div className="d-flex flex-grow-1 ps-3 ps-md-1 pe-2">
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
                  className="btn btn-link w-100 me-2 me-md-0"
                  onClick={() => navigate('/search?q=' + searchValue)}
                  disabled={searchValue.length < 2}
                >
                  <i className="bi bi-search text-white"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-fill ps-md-3">
              <div className="main-view d-flex flex-column flex-md-row flex-md-fill justify-content-center">
                <div className="d-flex flex-column align-self-center position-relative">
                  <img
                    width="auto" style={{ maxWidth: "300px" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center">
                    <span>Tighten your shoelaces thanks to the</span>
                    <h1 className="text-white">MFL Assistant.</h1>
                  </div>

                  <div className="media-mfl">
                    <a className="h4" target="_blank" href="https://app.playmfl.com/users/0xdf26376de6cba19e">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 55.541065 17.780001"
                        height="14"
                        version="1.1"
                        className="NavMobile_logo__ws_KV"
                      >
                        <g transform="translate(227.49086,-63.017615)">
                          <path fill="#0dcaf0" d="m -202.64966,63.017615 -3.5052,17.78 h -5.461 l 1.5748,-8.1026 -5.0038,6.5024 h -2.6416 l -2.7432,-6.4008 -1.6002,8.001 h -5.461 l 3.556,-17.78 h 4.8768 l 3.8608,9.4488 7.4422,-9.4488 z"></path>
                          <path fill="#0dcaf0" d="m -194.64548,67.538815 -0.6096,3.048 h 7.4168 l -0.9144,4.5212 h -7.3914 l -1.143,5.6896 h -5.9944 l 3.556,-17.78 h 14.4526 l -0.9144,4.5212 z"></path>
                          <path fill="#0dcaf0" d="m -183.35439,63.017615 h 5.9944 l -2.6162,13.1318 h 8.0264 l -0.9398,4.6482 h -14.0208 z"></path>
                        </g>
                      </svg>
                    </a>
                  </div>

                  <div className="media-discord">
                    <a className="h4" target="_blank" href="https://discord.com/users/_alexisp.">
                      <i className="bi bi-discord text-info"></i>
                    </a>
                  </div>

                  <div className="media-x">
                    <a className="text-white h5 ms-1" target="_blank" href="https://twitter.com/Alexis_MFL">
                      <i className="bi bi-twitter-x text-info"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column card my-1 pt-1 pb-2 px-3 m-2 m-md-0">
                <div className="d-flex flex-column my-1 pt-1">
                  <div className="d-flex h4 pt-1 px-2">
                    <i className="bi bi-clipboard-data-fill mx-1"></i> Dashboard
                  </div>

                  <div className="d-flex flex-column flex-md-row">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/dash/marketplace"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-shop mx-1"></i>Marketplace
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/dash/clubs"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-buildings mx-1"></i> Clubs
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/dash/players"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-person-badge mx-1"></i> Players
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column my-1 pt-1">
                  <div className="d-flex h4 pt-1 px-2">
                    <i className="bi bi-wrench-adjustable-circle-fill mx-1"></i> Tools
                  </div>

                  <div className="d-flex flex-column flex-md-row max-height-md-200">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/tools/player-pricing"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-currency-exchange mx-1"></i> Player pricing
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/tools/contract-evaluation"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi bi-journal-bookmark-fill mx-1"></i> Contract eval.
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                      <Link
                        to="/tools/team-builder"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-clipboard2-check-fill mx-1"></i> Team builder
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column mt-1 py-2">
                  <div className="d-flex flex-column flex-md-row">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 justify-content-center p-1 me-0 me-md-1">
                      <Link
                        to="/notification"
                        className={"nav-link text-white"}
                      >
                        <i className="bi bi-alarm-fill mx-1"></i> Notification center
                      </Link>
                    </div>

                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 justify-content-center p-1">
                      <Link
                        className={"nav-link text-dark"}
                      >
                        <i className="bi bi-cone-striped mx-1"></i> Soon to come!
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-grow-1 flex-md-basis-50p py-md-3 pe-md-3" style={{ minWidth: "0" }}>
            <div className="d-flex flex-column card flex-grow-0 py-2 pb-3 px-3 m-2 m-md-0 mb-md-2" style={{ minWidth: "0" }}>
              <h4><i className="bi bi-activity me-1"></i> MFL Activity</h4>

              <div className="d-flex flex-column flex-fill">
                <div className="d-flex flex-column flex-grow-1 mb-1">
                  <div>
                    Latest listings
                  </div>

                  <div className="d-flex flex-row">
                    {playerListings
                      ? <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {playerListings.map((o) => (
                              <ItemCardSale
                                s={o}
                              />
                            ))}
                          </div>
                        }
                      />
                      : <div className="w-100" style={{ height: "95px" }}>
                        <LoadingSquare />
                      </div>
                    }
                  </div>
                </div>

                <div className="d-flex flex-column flex-grow-1">
                  <div>
                    Latest sales
                  </div>

                  <div className="d-flex flex-row">
                    {playerSales
                      ? <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {playerSales.map((o) => (
                              <ItemCardSale
                                s={o}
                              />
                            ))}
                          </div>
                        }
                      />
                      : <div className="w-100" style={{ height: "95px" }}>
                        <LoadingSquare />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column card flex-grow-1 flex-fill py-2 px-3 m-2 mb-4 m-md-0 overflow-auto" style={{ minWidth: "0" }}>
              <h4><i className="bi bi-person-hearts me-1"></i> Community</h4>

              <div className="d-flex flex-column flex-fill">
                <div className="position-relative">
                <div className="d-flex flex-column flex-grow-1 mb-1">
                  <div>
                    Content creators
                  </div>

                  <div className="d-flex flex-row flex-fill">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {contentCreators.map((o) => (
                            <ItemCardCommunityMember
                              name={o.name}
                              link={o.link}
                              countries={(o.countries)}
                              image={o.image}
                              platforms={o.platforms}
                            />
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>
                
                <div className="d-flex flex-column flex-grow-1 mb-1">
                  <div>
                    Tools
                  </div>

                  <div className="d-flex flex-row flex-fill">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {tools.map((o) => (
                            <ItemCardCommunityMember
                              name={o.name}
                              link={o.link}
                              countries={(o.countries)}
                              image={o.image}
                              platforms={o.platforms}
                            />
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-grow-1 mb-1">
                  <div>
                    Initiatives
                  </div>

                  <div className="d-flex flex-row flex-fill">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {initiatives.map((o) => (
                            <ItemCardCommunityMember
                              name={o.name}
                              link={o.link}
                              countries={(o.countries)}
                              image={o.image}
                              platforms={o.platforms}
                            />
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-grow-1 mb-1">
                  <div>
                    Club socials
                  </div>

                  <div className="d-flex flex-row flex-fill">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {clubSocials.map((o) => (
                            <ItemCardCommunityMember
                              name={o.name}
                              link={o.link}
                              countries={(o.countries)}
                              image={o.image}
                              platforms={o.platforms}
                            />
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div></div> <
    /div> < /
    div > < /
    div > <
    /div> < /
    div > <
    /div>
  );
};

export default PageHome;