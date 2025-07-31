import ItemRowUser from "components/items/ItemRowUser.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { getUsers } from "services/api-assistant.js";

interface PopupUserListPerGeographyProps {
  onClose: func;
  country: String;
  city: String;
  open: Boolean;
}

const PopupUserListPerGeography: React.FC<PopupUserListPerGeographyProps> = ({ onClose, country, city, open }) => {
  const [users, setUsers] = useState(null);

  const onOpen = () => {
    getUsers({
      handleSuccess: (d) => {
        setUsers(d.data.getUsers);
      },
      handleError: (e) => console.log(e),
      params: { city, country, hasClub: true },
    });
  };

  return (
    <div className="PopupUserListPerGeography">
      <Popup
        open={open}
        modal
        closeOnDocumentClick
        onClose={onClose && onClose()}
        onOpen={() => onOpen()}
        className={"fade-in popup-lg"}
      >
        {(close) => (
          <div>
            <div className="d-flex flex-row flex-grow-0 mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Users</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1 flex-column mb-3 overflow-auto">
              {users ? (
                users.map((p) => <ItemRowUser c={p} />)
              ) : (
                <div className="ratio ratio-16x9 w-100">
                  <LoadingSquare />
                </div>
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupUserListPerGeography;
