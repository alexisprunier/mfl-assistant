import React from "react";
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";

interface ItemRowPlayerProps {
  p: object;
}

const ItemRowPlayer: React.FC<ItemRowPlayerProps> = ({ p }) => {
  return (
    <div className="Item ItemRowPlayer">
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-row flex-md-basis-300">
          <i className="bi bi-person-badge-fill me-1" />

          <div className="d-flex flex-basis-40">{p.metadata.overall}</div>

          <div className="d-flex fill">
            {p.metadata.firstName} {p.metadata.lastName}
          </div>
        </div>

        <div className="d-flex flex-md-grow-1">
          {p.metadata.nationalities[0] ? (
            <img
              className="d-inline me-1 my-1 ms-md-1"
              style={{ height: 14 }}
              src={`https://app.playmfl.com/img/flags/${p.metadata.nationalities[0]}.svg`}
            />
          ) : (
            ""
          )}

          {p.metadata.nationalities[0] ? p.metadata.nationalities[0] : ""}
        </div>

        <div className="d-flex flex-row flex-md-grow-0 justify-content-end">
          <div className="me-1">
            <ButtonMflPlayerInfo playerId={p.id} />
          </div>
          <div>
            <ButtonMflPlayer playerId={p.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRowPlayer;
