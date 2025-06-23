import ItemCardClub from "components/items/ItemCardClub.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import BoxMessage from "components/box/BoxMessage.js";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { getClubs } from "services/api-assistant.js";

interface PopupSelectClubProps {
  trigger: Object;
  onClose: func;
  onConfirm: func;
  userId: String;
}

const PopupSelectClub: React.FC<PopupSelectClubProps> = ({
  trigger,
  onClose,
  onConfirm,
  userId,
}) => {
  const [clubs, setClubs] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubSearch, setClubSearch] = useState("");

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs);
      },
      handleError: (e) => console.log(e),
      params:
        clubSearch === ""
          ? { owners: [userId] }
          : { search: clubSearch, limit: 20 },
    });
  };

  const onOpen = () => {
    fetchClubs();
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
          <div className="container bg-dark d-flex flex-column border border-main border-3 rounded-3 p-4">
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

            <div className="d-flex flex-grow-0 flex-column mb-2">
              <div className="d-flex flex-row mb-3">
                <input
                  type="text"
                  className="form-control me-1"
                  value={clubSearch}
                  onChange={(v) => setClubSearch(v.target.value)}
                  placeholder={"Club name, city, country, ..."}
                  disabled={true}
                  autoFocus
                />
                <button
                  className="btn btn-warning text-white d-flex flex-row"
                  onClick={() => fetchClubs()}
                  disabled={true}
                >
                  <i className="d-inline bi bi-lock-fill" />
                  &nbsp;Locked
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1 flex-column mb-3 overflow-auto">
              {clubs ? (
                clubs.length > 0 ? (
                  clubs.map((p) => (
                    <div>
                      <ItemCardClub
                        id={p.id}
                        name={p.name}
                        onClick={() => setSelectedClub(p)}
                        selected={selectedClub && selectedClub.id === p.id}
                      />
                    </div>
                  ))
                ) : (
                  <BoxMessage className={"py-5"} content={"No club found"} />
                )
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
