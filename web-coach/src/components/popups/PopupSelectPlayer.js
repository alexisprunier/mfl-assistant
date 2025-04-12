import BoxMessage from "components/box/BoxMessage.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import React, { useState } from "react";
import Popup from "reactjs-popup";

interface PopupSelectPlayerProps {
  trigger: Object;
  onClose: func;
  onConfirm: func;
  teamMembers: Object;
}

const PopupSelectPlayer: React.FC<PopupSelectPlayerProps> = ({
  trigger,
  onClose,
  onConfirm,
  teamMembers,
}) => {
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  const confirm = (close) => {
    if (onConfirm) {
      onConfirm(selectedTeamMember);
    }

    close();
  };

  return (
    <div className="PopupSelectPlayer">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={onClose && onClose()}
        className={"fade-in popup-xl"}
      >
        {(close) => (
          <div className="container bg-dark d-flex flex-column border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row flex-grow-0 mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Select team member</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1 flex-column mb-3 overflow-auto">
              {teamMembers ? (
                teamMembers
                  .filter((p) => p.player && !p.position)
                  .map((p) => (
                    <ItemRowPlayerAssist
                      p={p.player}
                      isSelected={
                        selectedTeamMember &&
                        selectedTeamMember.player.id === p.player.id
                      }
                      onSelect={() => setSelectedTeamMember(p)}
                    />
                  ))
              ) : (
                <BoxMessage content={"No team member found"} />
              )}
            </div>

            <div className="d-flex flex-grow-0 flex-row justify-content-end mt-3">
              <div>
                <button
                  className="btn btn-info text-white"
                  disabled={!selectedTeamMember}
                  onClick={() => confirm(close)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupSelectPlayer;
