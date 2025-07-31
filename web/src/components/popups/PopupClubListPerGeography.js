import ItemRowClub from "components/items/ItemRowClub.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useState } from "react";
import Popup from "reactjs-popup";
import { getClubs } from "services/api-assistant.js";

interface PopupClubListPerGeographyProps {
  onClose: func;
  country: String;
  city: String;
  open: Boolean;
  includeMfl: Boolean;
}

const PopupClubListPerGeography: React.FC<PopupClubListPerGeographyProps> = ({
  onClose,
  country,
  city,
  open,
  includeMfl,
}) => {
  const [clubs, setClubs] = useState(null);

  const onOpen = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs);
      },
      handleError: (e) => console.log(e),
      params: { city, country, includeMfl: includeMfl },
    });
  };

  return (
    <div className="PopupClubListPerGeography">
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
                <h2 className="text-white">Clubs</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-1 flex-column mb-3 overflow-auto">
              {clubs ? (
                clubs.map((p) => <ItemRowClub c={p} />)
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

export default PopupClubListPerGeography;
