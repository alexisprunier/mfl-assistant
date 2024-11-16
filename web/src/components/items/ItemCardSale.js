import React from 'react';
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import MiscOverall from "components/misc/MiscOverall.js";
import MiscFlag from "components/misc/MiscFlag.js";
import { unixTimestampToTimeString } from "utils/date.js";

interface ItemCardSaleProps {
  s: object;
}

const ItemCardSale: React.FC < ItemCardSaleProps > = ({ s }) => {
  return (
    <div className={"ItemCardSale Item no-hover flex-fill"}>
      <div className="card bg-black d-flex flex-column py-1 px-2" style={{ minWidth: "140px" }}>
        <div className="d-flex flex-row">
          <div className="pe-2">
            {s.player.metadata.firstName[0]}. {s.player.metadata.lastName}
          </div>

          <div className="d-flex flex-fill justify-content-end">
            <MiscOverall
              player={s.player.metadata}
            />
          </div>
        </div>

        <div className="d-flex flex-row">
          <div className="d-flex flex-row pt-1 pe-1">
            {s.player.metadata.nationalities.map((c) => (
              <MiscFlag
                key={c}
                country={c}
              />
            ))}
          </div>

          <div className="d-flex pe-2">
            {s.player.metadata.age}
          </div>

          <div className="d-flex flex-fill justify-content-end">
            {s.player.metadata.positions.join(',')}
          </div>
        </div>

        <div className="d-flex flex-row">
          <div className="text-dark pe-2">
            {s.status = "AVAILABLE"
              ? unixTimestampToTimeString(s.createdDateTime)
              : unixTimestampToTimeString(s.purchaseDateTime)}
          </div>

          <div className="d-flex flex-fill justify-content-end text-main">
            <i className="bi bi-currency-dollar"/> {s.price}
          </div>
        </div>

        <div className="d-flex flex-row justify-content-end">
          <div className="me-1">
            <ButtonMflPlayerInfo
              playerId={s.player.id}
            />
          </div>
          <div>
            <ButtonMflPlayer
              playerId={s.player.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardSale;