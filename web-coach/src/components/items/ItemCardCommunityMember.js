import React from "react";
import "./Item.css";
import MiscFlag from "components/misc/MiscFlag.js";

interface ItemCardCommunityMemberProps {
  image: string;
  countries: list;
  platforms: list;
  name: string;
  link: string;
}

const ItemCardCommunityMember: React.FC<ItemCardCommunityMemberProps> = ({
  image,
  countries,
  platforms,
  name,
  link,
}) => {
  return (
    <div className={"ItemCardCommunityMember Item flex-fill"}>
      <div
        className="card bg-black d-flex flex-fill flex-column py-1 px-2"
        style={{ width: "140px", height: "100px" }}
        onClick={() => window.open(link, "_blank")}
      >
        <div className="d-flex flex-fill flex-row">
          <div className="d-flex flex-fill flex-column flex-grow-1">
            <div className="d-flex flex-grow-1">
              <div className="d-flex flex-fill justify-content-center align-items-center p-1">
                {image ? (
                  <img src={image} style={{ borderRadius: "100%" }} />
                ) : (
                  <i className="bi bi-image" style={{ fontSize: "40px" }}></i>
                )}
              </div>
            </div>

            <div className="d-flex flex-grow-0 justify-content-center">
              {name}
            </div>
          </div>

          <div className="d-flex flex-column flex-grow-0">
            <div className="d-flex flex-grow-1 flex-column">
              {countries &&
                countries.map((c) => (
                  <div>
                    <MiscFlag key={c} country={c} />
                  </div>
                ))}
            </div>

            <div className="d-flex flex-grow-0 flex-column">
              {platforms &&
                platforms.map((p) => (
                  <div>
                    {p === "spotify" && <i className="bi bi-spotify"></i>}{" "}
                    {p === "youtube" && <i className="bi bi-youtube"></i>}{" "}
                    {p === "twitch" && <i className="bi bi-twitch"></i>}{" "}
                    {p === "discord" && <i className="bi bi-discord"></i>}{" "}
                    {p === "twitter" && <i className="bi bi-twitter"></i>}{" "}
                    {p === "tiktok" && <i className="bi bi-tiktok"></i>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardCommunityMember;
