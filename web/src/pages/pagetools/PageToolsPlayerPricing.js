import BoxMessage from "components/box/BoxMessage.js";
import ChartScatterPlayerSales from "components/charts/ChartScatterPlayerSales.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemSale from "components/items/ItemSale.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPlayerSales } from "services/api-assistant.js";
import { copyTextToClipboard } from "utils/clipboard.js";
import { positions, scarcity } from "utils/player.js";
import { convertDictToUrlParams } from "utils/url.js";

interface PageToolsPlayerPricingProps {}

const PageToolsPlayerPricing: React.FC<PageToolsPlayerPricingProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [overall, setOverall] = useState(
    searchParams.get("overall") ? parseInt(searchParams.get("overall")) : null
  );
  const [position, setPosition] = useState(
    searchParams.get("position") ? searchParams.get("position") : null
  );
  const [age, setAge] = useState(
    searchParams.get("age") ? parseInt(searchParams.get("age")) : null
  );

  const [sales, setSales] = useState(null);
  const [hideOneAndLower, setHideOneAndLower] = useState(false);
  const [timeUnit, setTimeUnit] = useState("m");

  const getData = (pursue, beforeListingId) => {
    setIsLoading(true);
    setSales(null);

    navigate({
      search:
        "?" +
        convertDictToUrlParams({
          overall,
          position,
          age,
        }),
    });

    getPlayerSales({
      handleSuccess: (v) => {
        setSales(v.data.getPlayerSales);
        setIsLoading(false);
      },
      params: {
        type: "PLAYER",
        limit: 1000000,
        minOvr:
          scarcity.map((s) => s.overallMin).indexOf(overall) < 0
            ? overall - 1
            : overall,
        maxOvr:
          scarcity.map((s) => s.overallMax).indexOf(overall) < 0
            ? overall + 1
            : overall,
        positions: [position],
        minAge: age - 1,
        maxAge: age + 1,
      },
    });
  };

  useEffect(() => {
    if (overall && position && age) {
      getData();
    }
  }, []);

  return (
    <div id="PageToolsPlayerPricing" className="h-100 w-100">
      <div className="container-xl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row h-100 w-100 fade-in">
          <div className="d-flex flex-column flex-md-grow-0 flex-md-basis-300">
            <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2">
              <div className="d-flex flex-row flex-md-grow-1">
                <h4 className="flex-grow-1">Player profile</h4>

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

              <div className="d-flex flex-fill flex-column">
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
                <button
                  className="btn btn-info text-white align-self-end"
                  onClick={getData}
                  disabled={!overall || !position || !age}
                >
                  Run
                </button>
              </div>
            </div>

            {/*<div className="card d-flex flex-column flex-fill m-2 p-3 pt-2">
              <div className="d-flex flex-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Pricing</h4>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden">
                <BoxSoonToCome />
              </div>
            </div>*/}
          </div>

          <div className="d-flex flex-column flex-md-column flex-md-grow-1">
            <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 m-2 p-3 pt-2">
              <div className="d-flex flex-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Player sales</h4>
                </div>

                <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                  <small className="me-md-3">
                    Hide 1$ and lower
                    <input
                      type="checkbox"
                      className="ms-1"
                      value={hideOneAndLower}
                      onChange={() => setHideOneAndLower(!hideOneAndLower)}
                    />
                  </small>

                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "w" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("w")}
                  >
                    W
                  </button>
                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "m" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("m")}
                  >
                    M
                  </button>
                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "q" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("q")}
                  >
                    Q
                  </button>
                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "y" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("y")}
                  >
                    Y
                  </button>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden">
                <div className="d-flex flex-fill overflow-hidden">
                  {!sales && !isLoading ? (
                    <BoxMessage content="No criteria selected" />
                  ) : (
                    <ChartScatterPlayerSales
                      sales={sales}
                      timeUnit={timeUnit}
                      hideOneAndLower={hideOneAndLower}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 m-2 p-3 pt-2 max-height-md-200">
              <div className="d-flex flex-row flex-md-grow-0">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Player list</h4>
                </div>
              </div>

              <div className="d-flex flex-fill flex-column overflow-auto">
                {!sales && !isLoading && (
                  <BoxMessage
                    className={"py-4 py-md-0"}
                    content={"No selection"}
                  />
                )}

                {isLoading && <LoadingSquare />}

                {sales?.length === 0 && (
                  <BoxMessage
                    className={"py-4 py-md-0"}
                    content={"No sales found"}
                  />
                )}

                {sales &&
                  !isLoading &&
                  sales
                    .sort((a, b) =>
                      b.executionDate.localeCompare(a.executionDate)
                    )
                    .map((p) => (
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-grow-1 me-1">
                          <ItemSale s={p} />
                        </div>
                        <div className="d-flex flex-grow-1 me-1">
                          <ItemRowPlayerAssist p={p.player} />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsPlayerPricing;
