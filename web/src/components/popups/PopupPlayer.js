import React from "react";
import Popup from "reactjs-popup";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";

interface PopupPlayerProps {
  className: String;
  player: Object;
  trigger: Object;
}

const PopupPlayer: React.FC<PopupPlayerProps> = ({
  className,
  player,
  trigger,
}) => {
  return (
    <div className="PopupPlayer d-flex flex-fill">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        className={"fade-in popup-lg " + className}
      >
        {(close) => (
          <div className="container bg-dark overflow-auto border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">
                  <i className="bi bi-person-badge-fill me-1" />
                  {player.firstName} {player.lastName}
                </h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="m-1 mb-3">
              <div className="d-flex flex-column flex-grow-0">
                <div className="me-1">
                  See on MFL Player:{" "}
                  <ButtonMflPlayerInfo playerId={player.id} />
                </div>
                <div>
                  See on MFL: <ButtonMflPlayer playerId={player.id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupPlayer;
