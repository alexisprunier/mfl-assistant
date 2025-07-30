import BoxCard from "components/box/BoxCard.js";
import BoxMessage from "components/box/BoxMessage.js";
import ChartScatterPlayerSales from "components/charts/ChartScatterPlayerSales.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemSale from "components/items/ItemSale.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPlayerSales } from "services/api-assistant.js";
import { getPlayerListings } from "services/api-mfl.js";
import { copyTextToClipboard } from "utils/clipboard.js";
import { positions } from "utils/player.js";
import { convertDictToUrlParams } from "utils/url.js";

interface PageToolsPlayerPricingProps {}

const PageToolsPlayerPricing: React.FC<PageToolsPlayerPricingProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [overall, setOverall] = useState(searchParams.get("overall") ? parseInt(searchParams.get("overall")) : "");
  const [position, setPosition] = useState(searchParams.get("position") ? searchParams.get("position") : "");
  const [age, setAge] = useState(searchParams.get("age") ? parseInt(searchParams.get("age")) : "");
  const [firstPositionOnly, setFirstPositionOnly] = useState(
    searchParams.get("firstPositionOnly") ? searchParams.get("firstPositionOnly") === "true" : false
  );

  const [isAdvancedModeActive, setIsAdvancedModeActive] = useState(
    searchParams.get("isAdvancedModeActive") ? searchParams.get("isAdvancedModeActive") === "true" : false
  );

  const [minAge, setMinAge] = useState(searchParams.get("minAge") ? parseInt(searchParams.get("minAge")) : "");
  const [maxAge, setMaxAge] = useState(searchParams.get("maxAge") ? parseInt(searchParams.get("maxAge")) : "");
  const [minOverall, setMinOverall] = useState(
    searchParams.get("minOverall") ? parseInt(searchParams.get("minOverall")) : ""
  );
  const [maxOverall, setMaxOverall] = useState(
    searchParams.get("maxOverall") ? parseInt(searchParams.get("maxOverall")) : ""
  );

  const [sales, setSales] = useState(null);
  const [hideOneAndLower, setHideOneAndLower] = useState(false);
  const [timeUnit, setTimeUnit] = useState("q");
  const [playerListings, setPlayerListings] = useState(null);

  const getData = (pursue, beforeListingId) => {
    setIsLoading(true);
    setSales(null);

    if (isAdvancedModeActive) {
      navigate({
        search:
          "?" +
          convertDictToUrlParams({
            minOverall,
            maxOverall,
            minAge,
            maxAge,
            position,
            firstPositionOnly,
            isAdvancedModeActive,
          }),
      });
    } else {
      navigate({
        search:
          "?" +
          convertDictToUrlParams({
            overall,
            age,
            position,
            firstPositionOnly,
            isAdvancedModeActive,
          }),
      });
    }

    getPlayerSales({
      handleSuccess: (v) => {
        setSales(v.data.getPlayerSales);
        setIsLoading(false);
      },
      params: {
        type: "PLAYER",
        limit: 500,
        minOvr: isAdvancedModeActive ? minOverall : overall - 1,
        maxOvr: isAdvancedModeActive ? maxOverall : overall + 1,
        positions: [position],
        minAge: isAdvancedModeActive ? minAge : age - 1,
        maxAge: isAdvancedModeActive ? maxAge : age + 1,
        firstPositionOnly,
      },
    });

    if (!isAdvancedModeActive) {
      fetchPlayerListings();
    } else {
      setPlayerListings(null);
    }
  };

  const fetchPlayerListings = () => {
    setPlayerListings(null);

    getPlayerListings({
      handleSuccess: (v) => {
        setPlayerListings(v);
      },
      handleError: (e) => {
        console.log(e);
      },
      params: {
        sorts: "listing.price",
        sortsOrders: "ASC",
        ageMax: age,
        overallMin: overall,
        positions: position,
        onlyPrimaryPosition: firstPositionOnly,
      },
    });
  };

  const isRunButtonActive = () => {
    if (position) {
      if (!isAdvancedModeActive) {
        return age && overall;
      }

      return minAge && maxAge && minOverall && maxOverall;
    }

    return false;
  };

  const clearForm = () => {
    setAge("");
    setMinAge("");
    setMaxAge("");
    setOverall("");
    setMinOverall("");
    setMaxOverall("");
    setPosition("");
    setFirstPositionOnly(false);
    setSales(null);

    navigate({
      search: "",
    });
  };

  useEffect(() => {
    if (
      (!isAdvancedModeActive && overall && position && age) ||
      (isAdvancedModeActive && minOverall && maxOverall && position && minAge && maxAge)
    ) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (!isAdvancedModeActive) {
      if (age) {
        setMinAge(age - 1);
        setMaxAge(age + 1);
      } else {
        setMinAge("");
        setMaxAge("");
      }
    }
  }, [age]);

  useEffect(() => {
    if (!isAdvancedModeActive) {
      if (overall) {
        setMinOverall(overall - 1);
        setMaxOverall(overall + 1);
      } else {
        setMinOverall("");
        setMaxOverall("");
      }
    }
  }, [overall]);

  return (
    <div id="PageToolsPlayerPricing" className="h-100 w-100">
      <div className="container-xl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row h-100 w-100">
          <div className="d-flex flex-column flex-md-grow-0 flex-md-basis-300">
            <BoxCard
              title={"Player profile"}
              actions={
                <div className="d-flex flex-row">
                  {(position || age || minAge || maxAge || overall || minOverall || maxOverall) && (
                    <div className="flex-glow-0">
                      <button
                        className="btn btn-sm btn-link align-self-start"
                        onClick={() => clearForm()}
                        data-bs-toggle="tooltip"
                        data-bs-title="Default tooltip"
                      >
                        <i class="bi bi-x-square-fill text-warning"></i>
                      </button>
                    </div>
                  )}

                  {sales && (
                    <div className="flex-glow-0">
                      <button
                        className="btn btn-sm btn-link align-self-start"
                        onClick={() => copyTextToClipboard(window.location.href)}
                      >
                        <i className="bi bi-share-fill" />
                      </button>
                    </div>
                  )}
                </div>
              }
              content={
                <div className="d-flex flex-fill flex-column">
                  {!isAdvancedModeActive ? (
                    <>
                      <input
                        type="number"
                        min="30"
                        max="100"
                        step="1"
                        className="form-control w-100 mb-1"
                        value={overall}
                        onChange={(v) => setOverall(parseInt(v.target.value))}
                        placeholder={"OVR"}
                        autoFocus
                      />
                      <input
                        type="number"
                        min="15"
                        max="40"
                        step="1"
                        className="form-control w-100 mb-1"
                        value={age}
                        onChange={(v) => setAge(parseInt(v.target.value))}
                        placeholder={"Age"}
                      />
                    </>
                  ) : (
                    <>
                      <div className="d-flex flex-row">
                        <input
                          type="number"
                          min="30"
                          max="100"
                          step="1"
                          className="form-control w-100 mb-1 me-1"
                          value={minOverall}
                          onChange={(v) => setMinOverall(parseInt(v.target.value))}
                          placeholder={"Min OVR"}
                        />
                        <input
                          type="number"
                          min="30"
                          max="100"
                          step="1"
                          className="form-control w-100 mb-1 ms-1"
                          value={maxOverall}
                          onChange={(v) => setMaxOverall(parseInt(v.target.value))}
                          placeholder={"Max OVR"}
                        />
                      </div>
                      <div className="d-flex flex-row">
                        <input
                          type="number"
                          min="15"
                          max="40"
                          step="1"
                          className="form-control w-100 mb-1 me-1"
                          value={minAge}
                          onChange={(v) => setMinAge(parseInt(v.target.value))}
                          placeholder={"Max age"}
                        />
                        <input
                          type="number"
                          min="15"
                          max="40"
                          step="1"
                          className="form-control w-100 mb-1 ms-1"
                          value={maxAge}
                          onChange={(v) => setMaxAge(parseInt(v.target.value))}
                          placeholder={"Max age"}
                        />
                      </div>
                    </>
                  )}

                  <select
                    className="form-select w-100 mb-1"
                    value={position}
                    onChange={(v) => setPosition(v.target.value)}
                    placeholder={"Position"}
                  >
                    <option value={""} key={null} />
                    {positions.map((p) => (
                      <option value={p.name} key={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex flex-fill justify-content-end align-items-end mb-1">
                    <small>
                      First position only
                      <input
                        type="checkbox"
                        className="ms-1"
                        checked={firstPositionOnly}
                        onChange={(p) => setFirstPositionOnly(!firstPositionOnly)}
                      />
                    </small>
                  </div>

                  <div className="d-flex flex-fill justify-content-end flex-row align-items-end mb-1">
                    <button
                      className="btn text-info align-self-end"
                      onClick={() => setIsAdvancedModeActive(!isAdvancedModeActive)}
                    >
                      <i class="bi bi-sliders2 text-info"></i> {isAdvancedModeActive ? "Basic" : "Advanced"}
                    </button>
                    <button
                      className="btn btn-info text-white align-self-end"
                      onClick={getData}
                      disabled={!isRunButtonActive()}
                    >
                      <i class="bi bi-arrow-right-square-fill text-white"></i> Run
                    </button>
                  </div>
                </div>
              }
            />

            {sales && sales.length === 500 && (
              <div class="alert alert-warning m-2 p-3 pt-2" role="alert">
                <div className="d-flex flex-row">
                  <i class="bi bi-cone-striped me-2"></i>
                  <div>Due to the broad selection, only the latest 500 sales are displayed.</div>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex flex-column flex-md-column flex-md-grow-1">
            <BoxCard
              className="flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0"
              title={"Player sales"}
              actions={
                <div className="d-flex flex-fill overflow-auto justify-content-end align-items-center">
                  <small className="me-md-3">
                    Hide &le; 1$
                    <input
                      type="checkbox"
                      className="ms-1"
                      value={hideOneAndLower}
                      onChange={() => setHideOneAndLower(!hideOneAndLower)}
                      disabled={!sales}
                    />
                  </small>

                  <button
                    className={"btn btn-small" + (timeUnit === "w" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("w")}
                    disabled={!sales}
                  >
                    W
                  </button>
                  <button
                    className={"btn btn-small" + (timeUnit === "m" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("m")}
                    disabled={!sales}
                  >
                    M
                  </button>
                  <button
                    className={"btn btn-small" + (timeUnit === "q" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("q")}
                    disabled={!sales}
                  >
                    Q
                  </button>
                  <button
                    className={"btn btn-small me-2" + (timeUnit === "y" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("y")}
                    disabled={!sales}
                  >
                    Y
                  </button>
                  <button
                    className="btn btn-info btn-small text-white"
                    onClick={() => {
                      const params = {
                        "metadata.age": ":" + age,
                        "metadata.overall": overall + ":",
                        "positions.name": position,
                        onlyPrimaryPosition: firstPositionOnly,
                      };
                      const url =
                        "https://app.playmfl.com/marketplace?sort=listing.price%3AASC&" +
                        convertDictToUrlParams(params);
                      window.open(url, "_blank");
                    }}
                    disabled={!overall || !position || !age}
                  >
                    Marketplace <i class="bi bi-caret-right-fill text-white"></i>
                  </button>
                </div>
              }
              content={
                <div className="d-flex flex-fill overflow-hidden">
                  <div className="d-flex flex-fill overflow-hidden">
                    {!sales && !isLoading ? (
                      <BoxMessage content="No selection" />
                    ) : (
                      <ChartScatterPlayerSales
                        sales={sales}
                        timeUnit={timeUnit}
                        hideOneAndLower={hideOneAndLower}
                        floor={playerListings?.[0]?.price}
                      />
                    )}
                  </div>
                </div>
              }
            />

            <BoxCard
              className="flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 max-height-md-200"
              title={"Player list"}
              contentClassName={"overflow-auto"}
              content={
                <div className="d-flex flex-fill h-100 flex-column overflow-auto">
                  {!sales && !isLoading && <BoxMessage className={"py-4 py-md-0"} content={"No selection"} />}

                  {isLoading && <LoadingSquare />}

                  {sales?.length === 0 && <BoxMessage className={"py-4 py-md-0"} content={"No sales found"} />}

                  {sales &&
                    !isLoading &&
                    sales
                      .sort((a, b) => b.executionDate.localeCompare(a.executionDate))
                      .map((p) => (
                        <div className="Item d-flex flex-column">
                          <div className="d-flex flex-grow-1 me-1">
                            <ItemSale s={p} />
                          </div>
                          <div className="d-flex flex-grow-1 me-1">
                            <ItemRowPlayerAssist p={p.player} />
                          </div>
                        </div>
                      ))}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsPlayerPricing;
