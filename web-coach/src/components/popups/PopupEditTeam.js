import React, { useState } from "react";
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import { updateTeam, deleteTeam } from "services/api-assistant.js";
import { prettifyId } from "utils/graphql.js";
import { copyTextToClipboard } from "utils/clipboard.js";

interface PopupEditTeamProps {
  trigger: object;
  team: Object;
  onClose: func;
  onUpdate: func;
}

const PopupEditTeam: React.FC<PopupEditTeamProps> = ({
  trigger,
  team,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const update = (params) => {
    updateTeam({
      handleSuccess: (v) => {
        nm.info("The team has been updated");
      },
      params: {
        id: team.id,
        ...params,
      },
    });
  };

  const removeTeam = (close, id) => {
    deleteTeam({
      handleSuccess: (v) => {
        if (onClose) onClose();
        if (close) close();
      },
      params: {
        id: id,
      },
    });
  };

  const closePopup = (close) => {
    if (close) close();
  };

  return (
    <div className="PopupEditTeam">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={() => closePopup()}
        onOpen={() => {
          setName(team.name);
          setIsPublic(team.isPublic === true);
        }}
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div className="container bg-dark border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Edit the team</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={() => closePopup(close)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-row mt-3">
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
                  disabled={team.name === name || name.length < 3}
                  onClick={() => update({ name })}
                >
                  <i className="bi bi-check-lg" />
                </button>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-end mt-3">
              <button
                className="btn btn-danger text-white"
                onClick={() => removeTeam(close, team.id)}
              >
                <i className="bi bi-x-circle me-2" /> Delete team
              </button>
            </div>

            {/*<div className="d-flex flex-row align-items-middle mt-3">
							<input
								className="form-check-input me-2"
								type="checkbox"
								checked={isPublic}
								onChange={() => {
									update({ isPublic: !isPublic });
									setIsPublic(!isPublic);
								}}
							/>
							<label
								className="form-check-label flex-grow-1"
							>
								Share the team publicly
							</label>
							<button
								className="btn btn-info text-white"
								disabled={!isPublic}
								onClick={() => copyTextToClipboard(`${window.location.href}?id=${team.id}`)}
							>
								<i className="bi bi-link-45deg"/> Copy link
							</button>
						</div>*/}
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupEditTeam;
