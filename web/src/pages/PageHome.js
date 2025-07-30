import BoxScrollDown from "components/box/BoxScrollDown.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import BoxCard from "components/box/BoxCard.js";
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
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [contentCreators] = useState(() => {
    var c = [
      {
        name: "WenDirkCast",
        image: "https://pbs.twimg.com/profile_images/1699478704479461376/FpyRcFYv_400x400.jpg",
        link: "https://linktr.ee/WenDirkCast",
        countries: ["ENGLAND"],
        platforms: ["twitch", "spotify"],
      },
      {
        name: "Calvinator",
        image: "https://pbs.twimg.com/profile_images/1731981717341151232/SskrGRnU_400x400.jpg",
        link: "https://www.youtube.com/channel/UCEOcyeQQ5cv2eAsD1NnWR6w",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "SRMonkey",
        image: "https://pbs.twimg.com/profile_images/1514224760036675584/MfTVLKVa_400x400.jpg",
        link: "https://open.spotify.com/show/4q8ZvGFlcIp9q1GQWNhRX7?si=WVDfzW9RR3KYP-xGbn3_OA&nd=1&dlsi=9afeee4459194df6",
        countries: ["ENGLAND"],
        platforms: ["spotify"],
      },
      {
        name: "Sorare Deke",
        image: "https://pbs.twimg.com/profile_images/1797465950544965632/tDy3uUIz_400x400.jpg",
        link: "https://www.youtube.com/@soraredeke",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "DomyDigital",
        image: "https://pbs.twimg.com/profile_images/1785241500822966272/lTac2y6D_400x400.jpg",
        link: "https://www.youtube.com/@DomyDigital",
        countries: ["ITALY"],
        platforms: ["youtube"],
      },
      {
        name: "Val2Play",
        image: "https://pbs.twimg.com/profile_images/1827083517269786624/_O5v4Lxg_400x400.jpg",
        link: "https://www.youtube.com/@Val2Play",
        countries: ["FRANCE"],
        platforms: ["youtube", "tiktok"],
      },
      {
        name: "Andy00fficial",
        image: "https://pbs.twimg.com/profile_images/1872138822042939392/VQVRDsIR_400x400.jpg",
        link: "https://www.linktr.ee/andy00fficial",
        countries: ["ENGLAND", "FRANCE"],
        platforms: ["twitch", "tiktok"],
      },
      {
        name: "Alex Benito",
        image: "https://pbs.twimg.com/profile_images/1831668492203880449/opZQi38n_400x400.jpg",
        link: "https://www.youtube.com/@AlexBenito",
        countries: ["FRANCE"],
        platforms: ["youtube"],
      },
      {
        name: "scoreadvise",
        image: "https://pbs.twimg.com/profile_images/1633883637304180736/L4zykxAZ_400x400.jpg",
        link: "https://www.youtube.com/@scoreadvise_official",
        countries: ["GERMANY"],
        platforms: ["youtube"],
      },
      {
        name: "Quinny",
        image: "https://pbs.twimg.com/profile_images/1897341620233682944/fkON3ANq_400x400.jpg",
        link: "https://www.youtube.com/@Quinny3001",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "Tim Lanew",
        image: "https://pbs.twimg.com/profile_images/1849863273769992192/rRZK1ZM7_400x400.jpg",
        link: "https://www.youtube.com/@CoachTimTV",
        countries: ["FRANCE"],
        platforms: ["youtube"],
      },
      {
        name: "McBrideAce",
        image: "https://pbs.twimg.com/profile_images/1674870536906629140/OSOxCQRz_400x400.jpg",
        link: "https://www.youtube.com/@McBrideAce",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "LeMatero",
        image: "https://pbs.twimg.com/profile_images/1905863386279133184/J80f4qmb_400x400.jpg",
        link: "https://x.com/LeMatero",
        countries: ["FRANCE"],
        platforms: ["twitch"],
      },
      {
        name: "Zlataneur_89",
        image: "https://pbs.twimg.com/profile_images/1359944317469679621/Gl2vxD8Z_400x400.jpg",
        link: "https://www.youtube.com/channel/UCWMYhHuZBAQFIIBMM19xCyw",
        countries: ["FRANCE"],
        platforms: ["youtube"],
      },
      {
        name: "Josalde",
        image: "https://pbs.twimg.com/profile_images/1667163482930675714/oiwn_Ibx_400x400.jpg",
        link: "https://www.youtube.com/@SorareJosalde",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
      },
      {
        name: "fabmizz.eth",
        image: "https://pbs.twimg.com/profile_images/1642253926257893376/vHqFOG-B_400x400.jpg",
        link: "https://fabmizz.de/allsocials",
        countries: ["ENGLAND"],
        platforms: ["youtube", "twitch"],
      },
      {
        name: "Willy Alba",
        image: "https://pbs.twimg.com/profile_images/1820254851541893120/ENBDeK15_400x400.jpg",
        link: "https://linktr.ee/willyalba",
        countries: ["SPAIN"],
        platforms: ["youtube", "twitch"],
      },
      {
        name: "Jakob",
        image: "https://pbs.twimg.com/profile_images/1778737519892295680/bIq17WyG_400x400.jpg",
        link: "https://www.youtube.com/@MrFutlovers",
        countries: ["GERMANY"],
        platforms: ["youtube"],
      },
      {
        name: "Cambridge PFC",
        image:
          "https://yt3.googleusercontent.com/RrCcDheco698-5D0s3hRnhX-__AaLCkpVPKvX3FiS4TBx4xWk0OqWoW2QeJkmSXgt9K0l9Ah=s160-c-k-c0x00ffffff-no-rj",
        link: "https://www.youtube.com/@CambridgePhoenixMFL",
        countries: ["ENGLAND"],
        platforms: ["youtube"],
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
        image: "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
        link: "https://mflmanager.fr/",
        countries: [],
      },
      {
        name: "MetaFixerLab",
        image: "https://metafixerlab.com/mfl-logo.png",
        link: "https://metafixerlab.com/",
        countries: [],
      },
      {
        name: "Flowty",
        image: "https://pbs.twimg.com/profile_images/1899276983907069952/dUuP0Bxf_400x400.jpg",
        link: "https://www.flowty.io/",
        countries: [],
      },
      {
        name: "MFL Scout",
        link: "https://mflscout.com/",
        countries: [],
      },
      {
        name: "MFL Flow Stats",
        link: "https://flipsidecrypto.xyz/adriaparcerisas/mfl-stats-on-flow-r4GRp_",
      },
    ];
    return c; //.sort(() => Math.random() - 0.5);
  });

  const [initiatives] = useState(() => {
    var c = [
      {
        name: "MFL Manager",
        image: "https://pbs.twimg.com/profile_images/1721134227213750272/VsG_pArI_400x400.png",
        link: "https://discord.gg/GMuRDJsq",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "K-Socios",
        image: "https://pbs.twimg.com/profile_images/1874941714101608448/aPxojvER_400x400.jpg",
        link: "https://x.com/K_Socios_MFL",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "Vulrak Académ.",
        image: "https://cdn.discordapp.com/icons/1276645403600883835/7114a539a9ad1feddab234f46ef6a89a.webp?size=128",
        link: "https://discord.gg/yzsqv92c",
        countries: ["FRANCE"],
        platforms: ["discord"],
      },
      {
        name: "WenDirkCast",
        image: "https://cdn.discordapp.com/icons/1354002743416721418/19fcbe5bcaf369e7a0d268421b2fe1df.png?size=128",
        link: "https://discord.gg/qEByWrxw",
        countries: ["ENGLAND"],
        platforms: ["discord"],
      },
      {
        name: "Duelz MFL",
        image: "https://cdn.discordapp.com/icons/1363658135008575599/87593ae8c5bc78426050838cfe3045bd.png?size=128",
        link: "https://discord.gg/uENzPqq6",
        countries: ["ENGLAND"],
        platforms: ["discord"],
      },
    ];
    return c.sort(() => Math.random() - 0.5);
  });

  const [clubSocials] = useState(() => {
    var c = [
      {
        name: "Sambre Hearts",
        image: "https://pbs.twimg.com/profile_images/1792928428770942976/H_WfZk8c_400x400.jpg",
        link: "https://x.com/SambreHearts",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Apollo Sports Gr.",
        image: "https://pbs.twimg.com/profile_images/1409242215990300682/8Yd96nWf_400x400.jpg",
        link: "https://x.com/apollo11collect",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Sunfire Jaguars",
        image: "https://pbs.twimg.com/profile_images/1791094944779714561/hFiIp9ZX_400x400.jpg",
        link: "https://x.com/Sunfire_Jaguars",
        countries: ["ENGLAND"],
        platforms: ["twitter"],
      },
      {
        name: "Porto Vermelho",
        image: "https://pbs.twimg.com/profile_images/1835804772512792576/OXKPiYTl_400x400.jpg",
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
      <div className="h-lg-100 w-100">
        <div className="d-flex h-lg-100 w-100 flex-column flex-lg-row flex-nowrap">
          <div
            className="d-flex flex-column flex-lg-grow-1 flex-lg-basis-50p h-100 pe-lg-3 pb-lg-3"
            style={{ minWidth: "0" }}
          >
            <div className="d-flex flex-column flex-lg-fill ps-lg-3">
              <div className="main-view d-flex flex-column flex-lg-row flex-lg-fill justify-content-center">
                <div className="d-flex flex-column align-self-center position-relative">
                  <img
                    width="auto"
                    style={{ maxWidth: "300px" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center">
                    <a href="https://www.buymeacoffee.com/mflassistant" target="_blank">
                      <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=mflassistant&button_colour=0dcaf0&font_colour=FFFFFF&font_family=Bree&outline_colour=000000&coffee_colour=FFDD00" />
                    </a>
                    {/*<span>Tighten your shoelaces thanks to the</span>
                    <h1 className="text-white">MFL Assistant.</h1>*/}
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
                    <a className="h4" target="_blank" href="https://discord.com/users/_alexisp." rel="noreferrer">
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
            </div>
          </div>
          <div className="d-flex flex-column flex-grow-1 flex-lg-basis-50p py-lg-3 pe-lg-3" style={{ minWidth: "0" }}>
            <BoxCard className="d-flex flex-fill" content={"Soon to come..."} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHome;
