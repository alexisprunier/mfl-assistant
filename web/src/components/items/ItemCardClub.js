import React from "react";
import "./Item.css";

interface ItemCardClubProps {
  id: number;
  name: string;
  text?: String;
  onClick?: func;
  selected: Boolean;
}

const ItemCardSale: React.FC<ItemCardSaleProps> = ({
  id,
  name,
  text,
  onClick,
  selected,
}) => {
  return (
    <div className={"ItemCardSale Item no-hover flex-fill"}>
      <div
        className={
          "card bg-black d-flex flex-row py-1 px-2 " +
          (selected ? "selected " : "") +
          (onClick ? "selectable" : "")
        }
        onClick={() => onClick && onClick(id)}
      >
        <div className="d-flex flex-row my-1">
          <img
            src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
            alt={`${name} logo`}
            style={{ height: "50px" }}
          />
        </div>

        <div className="d-flex flex-column flex-grow-1 ms-1">
          <div className="h5 my-1 d-inline text-truncate">{name}</div>
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardSale;
