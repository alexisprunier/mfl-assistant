import React, { useState } from "react";
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import { addTeam } from "services/api-assistant.js";
import { prettifyId } from "utils/graphql.js";

interface PopupAddTeamProps {
  trigger: Object;
  onClose: func;
}

const PopupAddTeam: React.FC<PopupAddTeamProps> = ({ trigger, onClose }) => {
  const [name, setName] = useState("");

  const confirm = (close) => {
    addTeam({
      handleSuccess: (v) => {
        if (v.errors) {
          nm.warning("Error while adding the team");
          return;
        }

        nm.info("The team has been added");
        if (onClose) onClose();
        close();
      },
      params: {
        name,
      },
    });
  };

  return (
    <div className="PopupAddTeam">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={onClose}
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div className="container bg-dark border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Add a new team</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-end mt-3">
              <input
                type="text"
                className="form-control w-100 me-1"
                value={name}
                onChange={(v) => setName(v.target.value)}
                placeholder={"Team name"}
                autoFocus
              />
              <div>
                <button
                  className="btn btn-info text-white"
                  disabled={name.length < 3}
                  onClick={() => confirm(close)}
                >
                  <i className="bi bi-check-lg" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupAddTeam;
