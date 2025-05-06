import BoxMessage from "components/box/BoxMessage.js";
import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { getPlayers } from "services/api-assistant.js";

interface PopupFormationInfoProps {
  trigger: React.ReactNode;
  onClose: () => void;
  data: Object;
}

const PopupFormationInfo: React.FC<PopupFormationInfoProps> = ({
  trigger,
  onClose,
  data,
}) => {
  if (!data) {
    return trigger;
  }

  const total = data.victories + data.draws + data.defeats;

  const winRate = total ? ((data.victories / total) * 100).toFixed(1) : "0.0";
  const drawRate = total ? ((data.draws / total) * 100).toFixed(1) : "0.0";
  const loseRate = total ? ((data.defeats / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="PopupAddPlayers h-100 w-100" style={{ cursor: "pointer" }}>
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={onClose}
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div className="container bg-dark text-white border border-pink border-3 rounded-3 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                {data.formation1} vs {data.formation2}
              </h4>
              <button className="btn btn-sm btn-outline-light" onClick={close}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="mb-3">
              <p className="mb-1">
                <strong>Engine:</strong> {data.engine}
              </p>
              <p className="mb-1">
                <strong>Total Matches:</strong> {total}
              </p>
            </div>

            <div className="mb-4">
              <ul className="list-group">
                <li className="list-group-item bg-transparent text-white d-flex justify-content-between">
                  <span>Wins</span>
                  <span>
                    {data.victories} ({winRate}%)
                  </span>
                </li>
                <li className="list-group-item bg-transparent text-white d-flex justify-content-between">
                  <span>Draws</span>
                  <span>
                    {data.draws} ({drawRate}%)
                  </span>
                </li>
                <li className="list-group-item bg-transparent text-white d-flex justify-content-between">
                  <span>Losses</span>
                  <span>
                    {data.defeats} ({loseRate}%)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupFormationInfo;
