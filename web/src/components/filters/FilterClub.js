import React from "react";
import "./FilterClub.css";
import Popup from "reactjs-popup";
import ControllerDivisions from "components/controllers/ControllerDivisions.js";
import { divisions } from "utils/division.js";

interface FilterClubProps {
  filters: dict;
  onChange: func;
  onClose?: func;
  showDivisions?: boolean;
}

const FilterClub: React.FC<FilterClubProps> = ({ filters, onChange, onClose, showDivisions }) => {
  const getDivisionTextValue = () => {
    if (filters.divisions) {
      const p = divisions.filter((p) => filters.divisions.indexOf(p.number) >= 0);

      if (p.length === divisions.length) {
        return "All";
      }

      if (p.length > 0) {
        return p.map((p) => p.name.substring(0, 4).toUpperCase()).join(",");
      }

      return "None";
    }

    return "All";
  };

  return (
    <div className="FilterClub">
      <Popup
        trigger={
          <div className="big-filter-box flex-row bg-body d-flex border btn border-info border-3 text-white p-1">
            <div className="d-flex align-items-center mx-3 my-2 h5">
              <i className="bi bi-filter-square-fill text-info"></i>
            </div>

            {showDivisions && getDivisionTextValue() !== "None" && (
              <div className="mx-2">
                <div className="text-white-50">DIV</div>
                {getDivisionTextValue()}
              </div>
            )}
          </div>
        }
        modal
        closeOnDocumentClick
        onClose={onClose}
        className={"slide-in"}
      >
        {(close) => (
          <div className="FilterClub-content popup-content">
            <div className="row mb-4">
              <div className="col">
                <h2 className="text-white">Filters</h2>
              </div>
              <div className="col-auto">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-4">
                {showDivisions && (
                  <ControllerDivisions
                    divisions={filters.divisions}
                    onChange={(p) =>
                      onChange({
                        ...filters,
                        divisions: p,
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="float-end">
                  <button className="btn btn-info text-white" onClick={close}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default FilterClub;
