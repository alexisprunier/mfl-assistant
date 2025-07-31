import ItemCardClub from "components/items/ItemCardClub.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { getClubs } from "services/api-assistant.js";

interface PopupSelectClubProps {
  trigger: Object;
  onClose: func;
  onConfirm: func;
  userId: String;
}

const PopupSelectClub: React.FC<PopupSelectClubProps> = ({ trigger, onClose, onConfirm, userId }) => {
  const [clubs, setClubs] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);

  const onOpen = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs);
      },
      handleError: (e) => console.log(e),
      params: { owners: [userId] },
    });
  };

  const onButtonConfirm = (close) => {
    if (onConfirm) {
      onConfirm(selectedClub);
    }

    close();
  };

  return (
    <div className="PopupSelectClub">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={onClose && onClose()}
        onOpen={() => onOpen()}
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div>
            <div className="d-flex flex-row flex-grow-0 mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Select club</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1 flex-column mb-3 overflow-auto">
              {clubs ? (
                clubs.map((p) => (
                  <ItemCardClub
                    id={p.id}
                    name={p.name}
                    onClick={() => setSelectedClub(p)}
                    selected={selectedClub && selectedClub.id === p.id}
                  />
                ))
              ) : (
                <div className="ratio ratio-16x9 w-100">
                  <LoadingSquare />
                </div>
              )}
            </div>

            <div className="d-flex flex-grow-0 flex-row justify-content-end mt-3">
              <div>
                <button
                  className="btn btn-info text-white"
                  disabled={!selectedClub}
                  onClick={() => onButtonConfirm(close)}
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

export default PopupSelectClub;
