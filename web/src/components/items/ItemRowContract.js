import React from "react";
import "./Item.css";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemRowClub from "components/items/ItemRowClub.js";

interface ItemRowContractProps {
  c: object;
}

const ItemRowContract: React.FC<ItemRowContractProps> = ({ c }) => {
  return (
    <div className="Item ItemRowContract" style={{ cursor: "default" }}>
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-column flex-basis-80">
          <div>
            <i className="bi bi-journal-bookmark-fill me-1" /> Contract
          </div>

          <div>
            {c.revenueShare / 100}%
            {c.totalRevenueShareLocked ? (
              <span className="small">
                &nbsp;+{(c.totalRevenueShareLocked - c.revenueShare) / 100}%
              </span>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="d-flex flex-column flex-md-grow-1 justify-content-end">
          <ItemRowClub c={c.club} />
          <ItemRowPlayerAssist p={c.player} />
        </div>
      </div>
    </div>
  );
};

export default ItemRowContract;
