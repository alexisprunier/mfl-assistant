import React, { useState, useEffect } from 'react';
import "./PageHome.css";
import { Link } from 'react-router-dom';
import BoxScrollDown from "components/box/BoxScrollDown.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscHorizontalScroll from "components/misc/MiscHorizontalScroll.js";
import MiscFlag from "components/misc/MiscFlag.js";
import ItemCardSale from "components/items/ItemCardSale.js";
import { getPlayerSales, getPlayerListings } from "services/api-mfl.js";

interface PageHomeProps {
  yScrollPosition: number;
}

const PageHome: React.FC < PageHomeProps > = ({ yScrollPosition }) => {
  const [searchValue, setSearchValue] = useState("");

  const [playerSales, setPlayerSales] = useState(null);
  const [playerListings, setPlayerListings] = useState(null);

  const contentCreators = [{
    image: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    link: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    countries: ["FRANCE"],
  }, ];

  const tools = [{
    image: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    link: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    countries: ["FRANCE"],
  }, ];

  const initiatives = [{
    image: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    link: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    countries: ["FRANCE"],
  }, ];

  const clubSocials = [{
    image: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    link: "https://d13e14gtps4iwl.cloudfront.net/players/36222/card_512.png",
    countries: ["FRANCE"],
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

  return (
    <div id="PageHome" className="h-100">
      {window.innerWidth < 768 && yScrollPosition < 100
        && <BoxScrollDown />
      }

      {window.innerWidth < 768 && yScrollPosition >= 100
        && <BoxScrollUp />
      }

      <div className="h-100 w-100">
        <div className="d-flex h-100 w-100 flex-column flex-md-row flex-nowrap">
          <div className="d-flex flex-column flex-grow-1 flex-md-basis-50p h-100 pe-md-3 pb-md-3" style={{ minWidth: "0" }}>
            <div className="d-flex bg-black py-2 px-md-2" style={{ borderBottomRightRadius: "10px" }}>
              <div className="d-flex flex-grow-1 ps-1 pe-2">
                <input
                  type="text"
                  className="form-control w-100"
                  value={searchValue}
                  onChange={(v) => setSearchValue(v.target.value)}
                  placeholder={"Search players, clubs, users..."}
                  autoFocus
                />
              </div>

              <div className="d-flex flex-grow-0">
                <button
                  type="text"
                  className="btn btn-link w-100"
                  onClick={() => setSearchValue(searchValue)}
                  disabled={searchValue.length < 2}
                >
                  <i className="bi bi-search text-white"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-fill ps-md-3">
              <div className="d-flex flex-column flex-md-row flex-fill justify-content-center">
                <div className="d-flex flex-column align-self-center">
                  <img
                    width="auto" style={{ maxWidth: "300px" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />
                  <span>Tighten your shoelaces thanks to the</span>
                  <h1 className="text-white">MFL Assistant.</h1>
                </div>
                {/*<div className="d-flex">
                  media
                </div>*/}
              </div>

              <div className="d-flex flex-column card my-1 pt-1 pb-2 rounded-3">
                <div className="d-flex h4 pt-1 px-2">
                  <i className="bi bi-clipboard-data-fill mx-1"></i> Dashboard
                </div>

                <div className="d-flex flex-column flex-md-row">
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-shop mx-1"></i>Marketplace
                    </Link>
                  </div>
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-buildings mx-1"></i> Clubs
                    </Link>
                  </div>
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-person-badge mx-1"></i> Players
                    </Link>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column card my-1 pt-1 pb-2 rounded-3">
                <div className="d-flex h4 pt-1 px-2">
                  <i className="bi bi-wrench-adjustable-circle-fill mx-1"></i> Tools
                </div>

                <div className="d-flex flex-column flex-md-row max-height-md-200">
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-currency-exchange mx-1"></i> Player pricing
                    </Link>
                  </div>
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi bi-journal-bookmark-fill mx-1"></i> Contract eval.
                    </Link>
                  </div>
                  <div className="d-flex flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-clipboard2-check-fill mx-1"></i> Team builder
                    </Link>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column card mt-1 py-2 rounded-3">
                <div className="d-flex flex-column flex-md-row max-height-md-200">
                  <div className="d-flex w-100 justify-content-center">
                    <Link
                      to="/search"
                      className={"nav-link text-white px-3"}
                    >
                      <i className="bi bi-alarm-fill mx-1"></i> Notification center
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-grow-1 flex-md-basis-50p py-md-3 pe-md-3" style={{ minWidth: "0" }}>
            <div className="d-flex flex-column card flex-grow-1 flex-fill mb-2 py-2 px-3" style={{ minWidth: "0" }}>
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
                      : <LoadingSquare />
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
                      : <LoadingSquare />
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column card flex-grow-1 flex-fill py-2 px-3" style={{ minWidth: "0" }}>
              <h4><i className="bi bi-person-hearts me-1"></i> Community</h4>

              <div className="d-flex flex-column flex-fill">
                <div className="d-flex flex-column flex-grow-1">
                  <div>
                    Content creators
                  </div>

                  <div className="d-flex flex-row">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {contentCreators.map((o) => (
                            <a href={o.link} target="_blank">
                              <div className="d-flex flex-row px-1">
                                <img
                                  style={{ maxWidth: "70px" }}
                                  src={o.image}
                                  alt="MFL Assistant"
                                  className="px-1"
                                />

                                <div className="d-flex flex-column">
                                  {o.countries && o.countries.map((c) => (
                                    <MiscFlag
                                      country={c}
                                    />
                                  ))}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>
                
                <div className="d-flex flex-column flex-grow-1">
                  <div>
                    Tools
                  </div>

                  <div className="d-flex flex-row">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {tools.map((o) => (
                            <a href={o.link} target="_blank">
                              <div className="d-flex flex-row px-1">
                                <img
                                  style={{ maxWidth: "70px" }}
                                  src={o.image}
                                  alt="MFL Assistant"
                                  className="px-1"
                                />

                                <div className="d-flex flex-column">
                                  {o.countries && o.countries.map((c) => (
                                    <MiscFlag
                                      country={c}
                                    />
                                  ))}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-grow-1">
                  <div>
                    Initiatives
                  </div>

                  <div className="d-flex flex-row">
                    <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {initiatives.map((o) => (
                            <a href={o.link} target="_blank">
                              <div className="d-flex flex-row px-1">
                                <img
                                  style={{ maxWidth: "70px" }}
                                  src={o.image}
                                  alt="MFL Assistant"
                                  className="px-1"
                                />

                                <div className="d-flex flex-column">
                                  {o.countries && o.countries.map((c) => (
                                    <MiscFlag
                                      country={c}
                                    />
                                  ))}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      }
                    />
                  </div>
                </div>

        <
        div className = "d-flex flex-column flex-grow-1" >
        <div>
                    Club socials
                  </div>

        <
        div className = "d-flex flex-row" >
        <MiscHorizontalScroll
                      content={
                        <div className="d-flex flex-row">
                          {clubSocials.map((o) => (
                            <a href={o.link} target="_blank">
                              <div className="d-flex flex-row px-1">
                                <img
                                  style={{ maxWidth: "70px" }}
                                  src={o.image}
                                  alt="MFL Assistant"
                                  className="px-1"
                                />

                                <div className="d-flex flex-column">
                                  {o.countries && o.countries.map((c) => (
                                    <MiscFlag
                                      country={c}
                                    />
                                  ))}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
  }
  /> < /
  div > <
    /div> < /
  div > <
    /div> < /
  div > < /
  div > < /
  div > < /
  div >
);
};

export default PageHome;