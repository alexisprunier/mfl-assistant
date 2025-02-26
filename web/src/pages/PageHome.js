import BoxMflActivity from "components/box/BoxMflActivity.js";
import BoxScrollDown from "components/box/BoxScrollDown.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";
import ControllerFlagCountry from "components/controllers/ControllerFlagCountry.js";
import ItemCardCommunityMember from "components/items/ItemCardCommunityMember.js";
import MiscHorizontalScroll from "components/misc/MiscHorizontalScroll.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PageHome.css";

interface PageHomeProps {
  yScrollPosition: number;
}

const PageHome: React.FC<PageHomeProps> = ({ yScrollPosition }) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [contentCreators] = useState(() => {
    var c = [
      {
        name: "WenDirkCast",
        image:
          "https://pbs.twimg.com/profile_images/1699478704479461376/FpyRcFYv_400x400.jpg",
        link: "https://linktr.ee/WenDirkCast",
        countries: ["ENGLAND"],
        platforms: ["twitch", "spotify"],
      },
      {
        name: "Calvinator",
        image:
          "https://pbs.twimg.com/profile_images/1731981717341151232/SskrGRnU_400x400.jpg",
        link: "https://www.youtube.com/channel/UCEOcyeQQ5cv2eAsD1NnWR6w",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "SRMonkey",
        image:
          "https://pbs.twimg.com/profile_images/1514224760036675584/MfTVLKVa_400x400.jpg",
        link: "https://open.spotify.com/show/4q8ZvGFlcIp9q1GQWNhRX7?si=WVDfzW9RR3KYP-xGbn3_OA&nd=1&dlsi=9afeee4459194df6",
        countries: ["ENGLAND"],
        platforms: ["spotify"],
      },
      {
        name: "Sorare Deke",
        image:
          "https://pbs.twimg.com/profile_images/1797465950544965632/tDy3uUIz_400x400.jpg",
        link: "https://www.youtube.com/@soraredeke",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "DomyDigital",
        image:
          "https://pbs.twimg.com/profile_images/1785241500822966272/lTac2y6D_400x400.jpg",
        link: "https://www.youtube.com/@DomyDigital",
        countries: ["ITALY"],
        platforms: ["youtube"],
      },
      {
        name: "Val2Play",
        image:
          "https://pbs.twimg.com/profile_images/1827083517269786624/_O5v4Lxg_400x400.jpg",
        link: "https://www.youtube.com/@Val2Play",
        countries: ["FRANCE"],
        platforms: ["youtube", "tiktok"],
      },
      {
        name: "SorareAndy00fficial",
        image:
          "https://pbs.twimg.com/profile_images/1872138822042939392/VQVRDsIR_400x400.jpg",
        link: "https://https://linktr.ee/andy00fficial",
        countries: ["ENGLAND"],
        platforms: ["twitch", "tiktok"],
      },
      {
        name: "Alex Benito",
        image:
          "https://pbs.twimg.com/profile_images/1831668492203880449/opZQi38n_400x400.jpg",
        link: "https://www.youtube.com/@AlexBenito",
        countries: ["FRANCE"],
        platforms: ["youtube"],
      },
      {
        name: "scoreadvise",
        image:
          "https://pbs.twimg.com/profile_images/1633883637304180736/L4zykxAZ_400x400.jpg",
        link: "https://www.youtube.com/@scoreadvise_official",
        countries: ["GERMANY"],
        platforms: ["youtube"],
      },
      {
        name: "Quinny",
        image:
          "https://pbs.twimg.com/profile_images/1638215583534555141/qnvlrbC0_400x400.jpg",
        link: "https://www.youtube.com/@Quinny3001",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "Tim Lanew",
        image:
          "https://pbs.twimg.com/profile_images/1849863273769992192/rRZK1ZM7_400x400.jpg",
        link: "https://www.youtube.com/@CoachTimTV",
        countries: ["FRANCE"],
        platforms: ["youtube"],
      },
      {
        name: "frenchmystiq",
        image:
          "https://pbs.twimg.com/profile_images/1651729224355442688/S-GAvtMq_400x400.jpg",
        link: "https://linktr.ee/frenchmystiq",
        countries: ["FRANCE"],
        platforms: ["youtube", "twitch"],
      },
      {
        name: "McBrideAce",
        image:
          "https://pbs.twimg.com/profile_images/1674870536906629140/OSOxCQRz_400x400.jpg",
        link: "https://www.youtube.com/@McBrideAce",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "LeMatero",
        image:
          "https://pbs.twimg.com/profile_images/1794289034186854400/X5nVbcio_400x400.jpg",
        link: "https://x.com/LeMatero",
        countries: ["FRANCE"],
        platforms: ["twitch"],
      },
    ];
    return c.sort(() => Math.random() - 0.5);
  });

  const [tools] = useState(() => {
    var c = [
      {
        name: "MFL Player Info",
        link: "https://mflplayer.info/",
        countries: [],
      },
      {
        name: "MFL Manager",
        image:
          "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
        link: "https://mflmanager.fr/",
        countries: [],
      },
      {
        name: "MFL Scout",
        link: "https://mflscout.com/",
        countries: [],
      },
      {
        name: "Flowty",
        image:
          "https://pbs.twimg.com/profile_images/1839328859818524672/NOH1yET3_400x400.jpg",
        link: "https://www.flowty.io/",
        countries: [],
      },
      {
        name: "MFL Flow Stats",
        link: "https://flipsidecrypto.xyz/adriaparcerisas/mfl-stats-on-flow-r4GRp_",
      },
    ];
    return c.sort(() => Math.random() - 0.5);
  });

  const [initiatives] = useState(() => {
    var c = [
      {
        name: "MFL Manager",
        image:
          "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
        link: "https://discord.gg/GMuRDJsq",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "K-Socios",
        image:
          "https://pbs.twimg.com/profile_images/1791564818417082368/pc2FH3vq_400x400.jpg",
        link: "https://x.com/K_Socios_MFL",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "Vulrak Académ.",
        image:
          "https://cdn.discordapp.com/icons/1276645403600883835/7114a539a9ad1feddab234f46ef6a89a.webp?size=128",
        link: "https://discord.gg/yzsqv92c",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "Twitter club list",
        image:
          "https://pbs.twimg.com/profile_images/1609671494187249665/YehoRvrC_400x400.png",
        link: "https://x.com/i/lists/1644128469939552256",
        platforms: ["twitter"],
      },
    ];
    return c.sort(() => Math.random() - 0.5);
  });

  const [clubSocials] = useState(() => {
    var c = [
      {
        name: "Sambre Hearts",
        image:
          "https://pbs.twimg.com/profile_images/1792928428770942976/H_WfZk8c_400x400.jpg",
        link: "https://x.com/SambreHearts",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Apollo Sports Gr.",
        image:
          "https://pbs.twimg.com/profile_images/1409242215990300682/8Yd96nWf_400x400.jpg",
        link: "https://x.com/apollo11collect",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Sunfire Jaguars",
        image:
          "https://pbs.twimg.com/profile_images/1791094944779714561/hFiIp9ZX_400x400.jpg",
        link: "https://x.com/Sunfire_Jaguars",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Porto Vermelho",
        image:
          "https://pbs.twimg.com/profile_images/1835804772512792576/OXKPiYTl_400x400.jpg",
        link: "https://x.com/Porto_Vermelho",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
    ];
    return c.sort(() => Math.random() - 0.5);
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchValue.length >= 2) {
        navigate("/search?q=" + searchValue);
      }
    }
  };

  const getUsedCountries = () => {
    const dataArrays = [contentCreators, tools, initiatives, clubSocials];
    const countriesSet = new Set();

    dataArrays.forEach((array) => {
      array.forEach((item) => {
        if (item.countries && item.countries.length > 0) {
          item.countries.forEach((country) => countriesSet.add(country));
        }
      });
    });

    return Array.from(countriesSet);
  };

  return (
    <div id="PageHome" className="h-100">
      {window.innerWidth < 768 && yScrollPosition < 100 && <BoxScrollDown />}
      {window.innerWidth < 768 && yScrollPosition >= 100 && <BoxScrollUp />}
      <div className="h-md-100 w-100">
        <div className="d-flex h-md-100 w-100 flex-column flex-md-row flex-nowrap">
          <div
            className="d-flex flex-column flex-md-grow-1 flex-md-basis-50p h-100 pe-md-3 pb-md-3"
            style={{ minWidth: "0" }}
          >
            <div
              className="searchBar d-flex py-2 px-md-2"
              style={{ borderBottomRightRadius: "10px" }}
            >
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
                  onClick={() => navigate("/search?q=" + searchValue)}
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
                    width="auto"
                    style={{ maxWidth: "300px" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center">
                    <span>Tighten your shoelaces thanks to the</span>
                    <h1 className="text-white">MFL Assistant.</h1>
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
                            fill="#0dcaf0"
                            d="m -202.64966,63.017615 -3.5052,17.78 h -5.461 l 1.5748,-8.1026 -5.0038,6.5024 h -2.6416 l -2.7432,-6.4008 -1.6002,8.001 h -5.461 l 3.556,-17.78 h 4.8768 l 3.8608,9.4488 7.4422,-9.4488 z"
                          ></path>
                          <path
                            fill="#0dcaf0"
                            d="m -194.64548,67.538815 -0.6096,3.048 h 7.4168 l -0.9144,4.5212 h -7.3914 l -1.143,5.6896 h -5.9944 l 3.556,-17.78 h 14.4526 l -0.9144,4.5212 z"
                          ></path>
                          <path
                            fill="#0dcaf0"
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
                      <i className="bi bi-discord text-info"></i>
                    </a>
                  </div>

                  <div className="media-x">
                    <a
                      className="text-white h5 ms-1"
                      target="_blank"
                      href="https://twitter.com/Alexis_MFL"
                      rel="noreferrer"
                    >
                      <i className="bi bi-twitter-x text-info"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column card my-1 pt-1 pb-1 px-3 m-2 m-md-0">
                <div className="d-flex flex-column mt-1 pt-1">
                  <div className="d-flex h5">
                    <i className="bi bi-clipboard-data me-2"></i>
                    Dashboard
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

                <div className="d-flex flex-column mt-1 pt-1">
                  <div className="d-flex h5">
                    <i className="bi bi-wrench-adjustable-circle me-2"></i>
                    Tools
                  </div>

                  <div className="d-flex flex-column flex-md-row max-height-md-200">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/tools/player-pricing"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-currency-exchange mx-1"></i> Player
                        pricing
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 me-0 me-md-1">
                      <Link
                        to="/tools/contract-evaluation"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi bi-journal-bookmark-fill mx-1"></i>
                        Contract evaluation
                      </Link>
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-md-row max-height-md-200">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                      <Link
                        to="/tools/team-builder"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-clipboard2-check-fill mx-1"></i>
                        Team builder
                      </Link>
                    </div>
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0">
                      <Link
                        to="/tools/match-observatory"
                        className={"nav-link text-white p-1"}
                      >
                        <i className="bi bi-clipboard-data-fill mx-1"></i>
                        Match observatory
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column mt-1 py-2">
                  <div className="d-flex h5">
                    <i className="bi bi-alarm me-2"></i>
                    Notification center
                  </div>

                  <div className="d-flex flex-column flex-md-row">
                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 justify-content-center p-1 me-0 me-md-1">
                      <Link
                        to="/notification/marketplace"
                        className={"nav-link text-white"}
                      >
                        <i className="bi bi-shop mx-1"></i> Marketplace
                      </Link>
                    </div>

                    <div className="d-flex card bg-black flex-grow-1 flex-shrink-1 flex-basis-0 min-width-0 justify-content-center p-1">
                      <Link
                        to="/notification/report"
                        className={"nav-link text-white"}
                      >
                        <i className="bi bi-calendar3 mx-1"></i> Daily report
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex flex-column flex-grow-1 flex-md-basis-50p py-md-3 pe-md-3"
            style={{ minWidth: "0" }}
          >
            <div
              className="d-flex flex-column card flex-grow-0 py-2 pb-3 px-3 m-2 m-md-0 mb-md-2"
              style={{ minWidth: "0" }}
            >
              <BoxMflActivity />
            </div>
            <div
              className="d-flex flex-column card flex-grow-1 flex-fill py-2 px-3 m-2 mb-4 m-md-0 overflow-auto"
              style={{ minWidth: "0" }}
            >
              <div className="d-flex flex-column flex-md-row">
                <div className="d-flex flex-grow-1">
                  <h4>
                    <i className="bi bi-person-hearts me-1"></i> Community
                  </h4>
                </div>

                <div className="d-flex flex-grow-0 mb-1 mb-md-2 align-self-end justify-content-center">
                  <ControllerFlagCountry
                    countries={getUsedCountries()}
                    selectedCountries={selectedCountries}
                    onChange={(v) => setSelectedCountries(v)}
                  />
                </div>
              </div>
              <div className="d-flex flex-column flex-fill">
                <div className="position-relative">
                  <div className="d-flex flex-column flex-grow-1 mb-1">
                    <div>Content creators</div>
                    <div className="d-flex flex-row flex-fill">
                      <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {contentCreators
                              .filter(
                                (c) =>
                                  !c.countries ||
                                  c.countries.length === 0 ||
                                  selectedCountries.length === 0 ||
                                  c.countries.find((country) =>
                                    selectedCountries.includes(country)
                                  )
                              )
                              .map((o) => (
                                <div>
                                  <ItemCardCommunityMember
                                    name={o.name}
                                    link={o.link}
                                    countries={o.countries}
                                    image={o.image}
                                    platforms={o.platforms}
                                  />
                                </div>
                              ))}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-grow-1 mb-1">
                    <div>Tools</div>
                    <div className="d-flex flex-row flex-fill">
                      <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {tools
                              .filter(
                                (tool) =>
                                  !tool.countries ||
                                  tool.countries.length === 0 ||
                                  selectedCountries.length === 0 ||
                                  tool.countries.find((country) =>
                                    selectedCountries.includes(country)
                                  )
                              )
                              .map((o) => (
                                <div>
                                  <ItemCardCommunityMember
                                    name={o.name}
                                    link={o.link}
                                    countries={o.countries}
                                    image={o.image}
                                    platforms={o.platforms}
                                  />
                                </div>
                              ))}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-grow-1 mb-1">
                    <div>Initiatives</div>
                    <div className="d-flex flex-row flex-fill">
                      <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {initiatives
                              .filter(
                                (c) =>
                                  !c.countries ||
                                  c.countries.length === 0 ||
                                  selectedCountries.length === 0 ||
                                  c.countries.find((country) =>
                                    selectedCountries.includes(country)
                                  )
                              )
                              .map((o) => (
                                <div>
                                  <ItemCardCommunityMember
                                    name={o.name}
                                    link={o.link}
                                    countries={o.countries}
                                    image={o.image}
                                    platforms={o.platforms}
                                  />
                                </div>
                              ))}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column flex-grow-1 mb-1">
                    <div>Club socials</div>
                    <div className="d-flex flex-row flex-fill">
                      <MiscHorizontalScroll
                        content={
                          <div className="d-flex flex-row">
                            {clubSocials
                              .filter(
                                (c) =>
                                  !c.countries ||
                                  c.countries.length === 0 ||
                                  selectedCountries.length === 0 ||
                                  c.countries.find((country) =>
                                    selectedCountries.includes(country)
                                  )
                              )
                              .map((o) => (
                                <div>
                                  <ItemCardCommunityMember
                                    name={o.name}
                                    link={o.link}
                                    countries={o.countries}
                                    image={o.image}
                                    platforms={o.platforms}
                                  />
                                </div>
                              ))}
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHome;
