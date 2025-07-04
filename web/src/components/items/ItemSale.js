import React from "react";
import { dateToTimezonedString } from "utils/date.js";
import "./Item.css";

interface ItemSaleProps {
  s: object;
}

const ItemSale: React.FC<ItemSaleProps> = ({ s }) => {
  return (
    <div className={"Item no-hover flex-fill"}>
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-row flex-md-basis-340">
          <i className="bi bi-currency-dollar text-main" />

          <div className="d-flex flex-fill text-main">
            <span className="d-inline-block text-truncate">{s.price}</span>
          </div>

          <div className="d-flex flex-basis-160">{s.overall}</div>
        </div>

        <div className="d-flex flex-row flex-fill">
          <div className="d-flex flex-basis-40">
            <i class="bi bi-cake2-fill me-1"></i>
            {s.age}
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
