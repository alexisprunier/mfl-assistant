import React from "react";
import "./Item.css";
import ButtonMflClub from "components/buttons/ButtonMflClub.js";

interface ItemClubProps {
  id: Int;
}

const ItemClub: React.FC<ItemClubProps> = ({ id }) => {
  return (
    <div className="ItemClub d-flex flex-column mb-2" style={{ maxWidth: 160 }}>
      <div className="d-flex align-self-center mb-1">
        <img
          className="w-100 px-2"
          src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
          alt={"Club " + id}
        />
      </div>
      <div className="d-flex align-self-center">
        <div className="me-1">
          <ButtonMflClub clubId={id} />
        </div>
      </div>
    </div>
  );
};

export default ItemClub;
