import React from 'react';
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import MiscOverall from "components/misc/MiscOverall.js";
import { dateToTimezonedString } from "utils/date.js";

interface ItemSaleProps {
  s: object;
}

const ItemSale: React.FC < ItemSaleProps > = ({ s }) => {
  return (
    <div className={"Item no-hover flex-fill"}>
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-row flex-fill">
          <i className="bi bi-currency-dollar text-main"/>

          <div className="d-flex flex-fill text-main">
            <span className="d-inline-block text-truncate">
              {s.price}
            </span>
          </div>

          <div className="d-flex flex-row flex-fill justify-content-end text-secondary">
            {dateToTimezonedString(s.executionDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSale;