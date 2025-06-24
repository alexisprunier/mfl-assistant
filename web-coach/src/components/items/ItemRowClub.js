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
    <div className="Item ItemRowPlayer w-100">
      <div className="d-flex flex-column flex-sm-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-sm-basis-300">
          <img
            className="me-1"
            src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${c?.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
            style={{ height: "18px", marginTop: "2px" }}
          />
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

          {overall && (
            <div className="d-flex flex-basis-80">
              <div style={{ opacity: ".2" }}>Ovr:&nbsp;</div>
              {overall}
            </div>
          )}
          {formation && (
            <div className="d-flex flex-basis-160">
              <div style={{ opacity: ".2" }}>&nbsp;Form.:&nbsp;</div>
              {formation}
            </div>
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
