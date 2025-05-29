import React from "react";
import "./Item.css";
import ButtonMflClub from "components/buttons/ButtonMflClub.js";
import ButtonMflManagerClub from "components/buttons/ButtonMflManagerClub.js";

interface ItemRowClubProps {
  c: object;
  overall?: Object;
  formation?: Object;
}

const ItemRowClub: React.FC<ItemRowClubProps> = ({ c, overall, formation }) => {
  return (
    <div className="Item ItemRowPlayer">
      <div className="d-flex flex-column flex-sm-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-sm-basis-300">
          <i className="bi bi-buildings-fill me-1" />
          {c.name ? c.name : "Non-established club"}
        </div>

        <div className="d-flex flex-sm-grow-1">
          <div className="d-flex flex-grow-1">
            {c.country ? (
              <img
                className="d-inline me-1 my-1 ms-md-1"
                style={{ height: 14 }}
                src={`https://app.playmfl.com/img/flags/${c.country}.svg`}
              />
            ) : (
              ""
            )}

            {c.city ? c.city : ""}
          </div>

          {overall && <div className="d-flex flex-basis-80">{overall}</div>}
          {formation && (
            <div className="d-flex flex-basis-140">{formation}</div>
          )}

          <div className="d-flex flex-row flex-sm-grow-0 justify-content-end">
            <div className="me-1">
              <ButtonMflManagerClub clubId={c.id} />
            </div>
            <div>
              <ButtonMflClub clubId={c.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRowClub;
