import React, { useState } from "react";
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import {
  addClubNotificationScope,
  deleteClubNotificationScope,
  getClubCountriesAndCities,
} from "services/api-assistant.js";
import { prettifyId } from "utils/graphql.js";
import { divisions as mflDivisions } from "utils/division.js";

interface PopupClubNotificationScopeProps {
  trigger: Object;
  item?: Object;
  assistantUser?: Object;
  onClose?: func;
  onDelete?: func;
}

const PopupClubNotificationScope: React.FC<PopupClubNotificationScopeProps> = ({
  trigger,
  item,
  assistantUser,
  onClose,
  onDelete,
}) => {
  const readOnly = typeof item?.id !== "undefined";

  const [typeValues] = useState(["listing", "sale"]);
  const [type, setType] = useState(typeValues[0]);

  const [countryList, setCountryList] = useState([]);
  const [countries, setCountries] = useState(
    item?.countries ? item.countries : []
  );

  const [cityList, setCityList] = useState([]);
  const [cities, setCities] = useState(item?.cities ? item.cities : []);

  const [divisionList, setDivisionList] = useState(
    mflDivisions.map((d) => d.number)
  );
  const [divisions, setDivisions] = useState(
    item?.divisions ? item.divisions : []
  );

  const [minPrice, setMinPrice] = useState(
    item?.minPrice ? item.minPrice : undefined
  );
  const [maxPrice, setMaxPrice] = useState(
    item?.maxPrice ? item.maxPrice : undefined
  );

  const confirm = (close) => {
    addClubNotificationScope({
      handleSuccess: (v) => {
        if (v.errors) {
          nm.warning("Error while adding the scope");
          return;
        }

        nm.info("The notification scope has been added");
        if (onClose) onClose();
        close();
      },
      params: {
        user: assistantUser ? assistantUser.address : undefined,
        type,
        minPrice,
        maxPrice,
        countries,
        cities,
        divisions,
      },
    });
  };

  const deleteScope = (close) => {
    deleteClubNotificationScope({
      handleSuccess: (v) => {
        if (v.errors) {
          nm.warning("Error while deleting the scope");
          return;
        }

        if (onDelete) {
          onDelete();
        }

        nm.info("The notification scope has been deleted");
        if (onClose) onClose();
        close();
      },
      params: {
        scopeId: item.id,
      },
    });
  };

  const getField = (value, setValue, placeholder = "") => {
    return (
      <input
        className="form-control w-auto flex-grow-0 me-1"
        disabled={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={(v) => setValue(parseInt(v.target.value, 10))}
        type="number"
        min="1"
        max="99"
        step="1"
      />
    );
  };

  const onOpen = () => {
    getClubCountriesAndCities({
      handleSuccess: (d) => {
        setCountryList(d.data.getClubCountries);
        setCityList(d.data.getClubCities);
      },
      handleError: (e) => console.log(e),
    });
  };

  return (
    <div className="PopupClubNotificationScope">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        onClose={onClose}
        onOpen={onOpen}
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div className="container bg-dark overflow-auto border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">
                  {readOnly
                    ? "Scope " + prettifyId(item.id)
                    : "Add a new scope"}
                </h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-row m-1 mb-3">
              <div className="flex-grow-1 align-self-center">
                Type of notification:
              </div>
              <div className="flex-grow-1 me-1">
                <select
                  className="form-select"
                  disabled={readOnly}
                  value={type}
                  onChange={(v) => setType(v.target.value)}
                >
                  {typeValues.map((v) => (
                    <option value={v} key={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex flex-row m-1">
                <div className="flex-grow-1 align-self-center">Price:</div>
                {getField(minPrice, setMinPrice, "min")}
                {getField(maxPrice, setMaxPrice, "max")}
              </div>
            </div>

            <div className="mb-2">
              <div className="row mb-1">
                <div className="col-6">Countries:</div>
                <div className="col-6">
                  <select
                    className="form-select"
                    disabled={readOnly}
                    value={countries}
                    onChange={(v) =>
                      setCountries(
                        Object.keys(v.target)
                          .filter((i) => v.target[i].selected)
                          .map((i) => v.target[i].value)
                      )
                    }
                    multiple
                  >
                    {countryList.map((v) => (
                      <option value={v} key={v}>
                        {v}
                      </option>
                    ))}
                  </select>

                  {countries.length > 0 && (
                    <div className="d-flex justify-content-end text-align-middle">
                      <small>{countries.length} selected</small>
                      {!readOnly && (
                        <button
                          className="btn btn-small btn-warning text-white ms-1 my-1"
                          onClick={() => setCountries([])}
                        >
                          <i className="bi bi-x-square-fill text-white"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="row m-1">
                <div className="col-6">Cities:</div>
                <div className="col-6">
                  <select
                    className="form-select"
                    disabled={readOnly}
                    value={cities}
                    onChange={(v) =>
                      setCities(
                        Object.keys(v.target)
                          .filter((i) => v.target[i].selected)
                          .map((i) => v.target[i].value)
                      )
                    }
                    multiple
                  >
                    {cityList.map((v) => (
                      <option value={v} key={v}>
                        {v}
                      </option>
                    ))}
                  </select>

                  {cities.length > 0 && (
                    <div className="d-flex justify-content-end text-align-middle">
                      <small>{cities.length} selected</small>
                      {!readOnly && (
                        <button
                          className="btn btn-small btn-warning text-white ms-1 my-1"
                          onClick={() => setCities([])}
                        >
                          <i className="bi bi-x-square-fill text-white"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="row m-1">
                <div className="col-6">Divisions:</div>
                <div className="col-6">
                  <select
                    className="form-select"
                    disabled={readOnly}
                    value={divisions.map(String)}
                    onChange={(v) =>
                      setDivisions(
                        Object.keys(v.target)
                          .filter((i) => v.target[i].selected)
                          .map((i) => parseInt(v.target[i].value, 10))
                      )
                    }
                    multiple
                  >
                    {divisionList.map((v) => (
                      <option value={String(v)} key={v}>
                        {v}
                      </option>
                    ))}
                  </select>

                  {divisions.length > 0 && (
                    <div className="d-flex justify-content-end text-align-middle">
                      <small>{divisions.length} selected</small>
                      {!readOnly && (
                        <button
                          className="btn btn-small btn-warning text-white ms-1 my-1"
                          onClick={() => setDivisions([])}
                        >
                          <i className="bi bi-x-square-fill text-white"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-end mt-3">
              <div>
                {readOnly ? (
                  <button
                    className="btn btn-danger text-white"
                    onClick={() => deleteScope(close)}
                  >
                    <i className="bi bi-trash3"></i> Delete
                  </button>
                ) : (
                  <button
                    className="btn btn-info text-white"
                    onClick={() => confirm(close)}
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupClubNotificationScope;
