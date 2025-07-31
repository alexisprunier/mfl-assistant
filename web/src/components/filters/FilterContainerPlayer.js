import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FilterContainerPlayer.css";
import Popup from "reactjs-popup";
import ControllerPositions from "components/controllers/ControllerPositions.js";
import ControllerOverallScore from "components/controllers/ControllerOverallScore.js";
import ControllerAge from "components/controllers/ControllerAge.js";
import { positions } from "utils/player.js";
import { convertDictToUrlParams } from "utils/url.js";
import { getPlayerNationalities } from "services/api-assistant.js";

interface FilterContainerPlayerProps {
  trigger: Object;
  filters: dict;
  onChange: func;
  onClose?: func;
  onApply?: func;
  showPositions?: boolean;
  showOverallScore?: boolean;
  showAge?: boolean;
  deactivateNavigate?: boolean;
}

const FilterContainerPlayer: React.FC<FilterContainerPlayerProps> = ({
  trigger,
  filters,
  onChange,
  onClose,
  onApply,
  showPositions,
  showOverallScore,
  showAge,
  deactivateNavigate,
}) => {
  const navigate = useNavigate();

  const [showAttributeDetail, setShowAttributeDetail] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);

  const [nationalityList, setNationalityList] = useState([]);

  const getPositionTextValue = () => {
    if (filters.positions) {
      const p = positions.filter((p) => filters.positions.indexOf(p.name) >= 0);

      if (p.length === positions.length) {
        return "All";
      }

      if (p.length > 0) {
        return p.map((p) => p.name).join(",");
      }

      return "All";
    }

    return "All";
  };

  const getOverallScoreTextValue = () => {
    if (filters.minOvr || filters.maxOvr) {
      let text = [];

      text.push(
        <>
          {" "}
          {filters.minOvr || (
            <>
              {" "}
              -<i className="bi bi-infinity"></i>{" "}
            </>
          )}
        </>
      );
      text.push(<i className="bi bi-arrow-right small mx-1"></i>);
      text.push(<> {filters.maxOvr || <i className="bi bi-infinity"></i>} </>);

      return text;
    }

    return "All";
  };

  const getAgeTextValue = () => {
    if (filters.minAge || filters.maxAge) {
      let text = [];

      text.push(
        <span>
          {filters.minAge || (
            <>
              - <i className="bi bi-infinity"></i>
            </>
          )}
        </span>
      );
      text.push(<i className="bi bi-arrow-right small mx-2"></i>);
      text.push(<span>{filters.maxAge || <i className="bi bi-infinity"></i>}</span>);

      return text;
    }

    return "All";
  };

  const onPopupClose = () => {
    if (!deactivateNavigate) {
      navigate({ search: "?" + convertDictToUrlParams(filters) });
    }

    if (onClose) {
      onClose();
    }
  };

  const onPopupApply = (close) => {
    if (!deactivateNavigate) {
      navigate({ search: "?" + convertDictToUrlParams(filters) });
    }

    if (onApply) {
      onApply();
    }

    close();
  };

  const getField = (value, fieldName, max = 99) => {
    return (
      <input
        className="form-control w-auto flex-grow-0 me-1"
        value={value}
        placeholder={fieldName.slice(0, 3).charAt(0).toUpperCase() + fieldName.slice(1, 3)}
        onChange={(v) =>
          onChange({
            ...filters,
            [fieldName]: parseInt(v.target.value, 10),
          })
        }
        type="number"
        min="1"
        max={max}
        step="1"
      />
    );
  };

  useEffect(() => {
    if (!deactivateNavigate) {
      navigate({ search: "?" + convertDictToUrlParams(filters) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOpen = () => {
    getPlayerNationalities({
      handleSuccess: (d) => {
        setNationalityList(d.data.getPlayerNationalities);
      },
      handleError: (e) => console.log(e),
    });
  };

  return (
    <div className="FilterContainerPlayer">
      <Popup trigger={trigger} modal onOpen={onOpen} onClose={onPopupClose} className={"slide-in"}>
        {(close) => (
          <div className="FilterContainerPlayer-content popup-content">
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
              <div className="col-md-12 mb-3">
                {showPositions && (
                  <ControllerPositions
                    positions={filters.positions}
                    onChange={(p) =>
                      onChange({
                        ...filters,
                        positions: p,
                      })
                    }
                  />
                )}

                <div className="d-flex flex-fill justify-content-end align-items-end">
                  <small>
                    First position only
                    <input
                      type="checkbox"
                      className="ms-1"
                      checked={filters.firstPositionOnly}
                      onChange={(p) =>
                        onChange({
                          ...filters,
                          firstPositionOnly: !filters.firstPositionOnly,
                        })
                      }
                    />
                  </small>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                {showOverallScore && (
                  <ControllerOverallScore
                    minOvr={filters.minOvr}
                    maxOvr={filters.maxOvr}
                    onChange={(min, max) =>
                      onChange({
                        ...filters,
                        minOvr: min,
                        maxOvr: max,
                      })
                    }
                  />
                )}
              </div>

              <div className="col-md-12 mb-3">
                {showAge && (
                  <ControllerAge
                    minAge={filters.minAge}
                    maxAge={filters.maxAge}
                    onChange={(min, max) =>
                      onChange({
                        ...filters,
                        minAge: min,
                        maxAge: max,
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end my-1">
              <div>
                <button className="btn btn-sm text-info" onClick={() => setShowProfileDetail(!showProfileDetail)}>
                  {showProfileDetail ? (
                    <span>
                      <i className="bi bi-dash"></i> Hide profile
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-plus"></i> Show profile
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showProfileDetail && (
              <div className="mt-1 mb-2">
                <div className="row">
                  <div className="col-3">NAT:</div>
                  <div className="col-9">
                    <select
                      className="form-select"
                      value={filters.nationalities}
                      onChange={(v) =>
                        onChange({
                          ...filters,
                          nationalities: Object.keys(v.target)
                            .filter((i) => v.target[i].selected)
                            .map((i) => v.target[i].value),
                        })
                      }
                      multiple
                    >
                      {nationalityList.map((v) => (
                        <option value={v} key={v}>
                          {v}
                        </option>
                      ))}
                    </select>

                    {filters.nationalities?.length > 0 && (
                      <div className="d-flex justify-content-end text-align-middle">
                        <small>{filters.nationalities?.length} selected</small>
                        <button
                          className="btn btn-small btn-warning text-white ms-1 my-1"
                          onClick={() =>
                            onChange({
                              ...filters,
                              nationalities: [],
                            })
                          }
                        >
                          <i className="bi bi-x-square-fill text-white"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <div className="d-flex flex-row ms-1 my-1">
                      <div className="flex-grow-1 align-self-center">HEI:</div>
                      {getField(filters.minHeight, "minHeight", 250)}
                      {getField(filters.maxHeight, "maxHeight", 250)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end mt-1 mb-2">
              <div>
                <button className="btn btn-sm text-info" onClick={() => setShowAttributeDetail(!showAttributeDetail)}>
                  {showAttributeDetail ? (
                    <span>
                      <i className="bi bi-dash"></i> Hide attributes
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-plus"></i> Show attributes
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showAttributeDetail && (
              <div className="mb-3">
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">PAC:</div>
                  {getField(filters.minPace, "minPace")}
                  {getField(filters.maxPace, "maxPace")}
                </div>
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">DRI:</div>
                  {getField(filters.minDribbling, "minDribbling")}
                  {getField(filters.maxDribbling, "maxDribbling")}
                </div>
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">PAS:</div>
                  {getField(filters.minPassing, "minPassing")}
                  {getField(filters.maxPassing, "maxPassing")}
                </div>
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">SHO:</div>
                  {getField(filters.minShooting, "minShooting")}
                  {getField(filters.maxShooting, "maxShooting")}
                </div>
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">DEF:</div>
                  {getField(filters.minDefense, "minDefense")}
                  {getField(filters.maxDefense, "maxDefense")}
                </div>
                <div className="d-flex flex-row ms-1 my-1">
                  <div className="flex-grow-1 align-self-center">PHY:</div>
                  {getField(filters.minPhysical, "minPhysical")}
                  {getField(filters.maxPhysical, "maxPhysical")}
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-12 mt-1">
                <div className="float-end">
                  <button className="btn btn-info text-white" onClick={() => onPopupApply(close)}>
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

export default FilterContainerPlayer;
