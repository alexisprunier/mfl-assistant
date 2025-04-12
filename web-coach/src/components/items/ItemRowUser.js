import React from "react";
import "./Item.css";
import ButtonMflUser from "components/buttons/ButtonMflUser.js";
import ButtonMflAssistantUser from "components/buttons/ButtonMflAssistantUser.js";

interface ItemRowUserProps {
  c: object;
}

const ItemRowUser: React.FC<ItemRowUserProps> = ({ c }) => {
  return (
    <div className="Item ItemRowPlayer">
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-md-basis-300">
          <i className="bi bi-person-fill me-1" />
          {c.address ? c.address : "Unknown address"}
        </div>

        <div className="d-flex flex-md-grow-1">
          <div className="d-flex flex-grow-1">{c.name ? c.name : ""}</div>

          <div className="d-flex flex-row flex-md-grow-0 justify-content-end">
            {c.address && (
              <div className="me-1">
                <ButtonMflUser address={c.address} />
              </div>
            )}
            {c.address && (
              <div>
                <ButtonMflAssistantUser address={c.address} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRowUser;
