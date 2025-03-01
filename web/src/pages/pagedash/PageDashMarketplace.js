import React, { useState, useEffect } from "react";
import Count from "components/counts/Count.js";
import { getMarketplaceData } from "services/api-assistant.js";
import ControllerDivisionsForChart from "components/controllers/ControllerDivisionsForChart.js";
import ChartBarSaleVolume from "components/charts/ChartBarSaleVolume.js";
import ChartScatterClubSales from "components/charts/ChartScatterClubSales.js";
import BoxSoonToCome from "components/box/BoxSoonToCome.js";
import BoxMflActivity from "components/box/BoxMflActivity.js";

interface PageDashMarketplaceProps {}

const PageDashMarketplace: React.FC<PageDashMarketplaceProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [timeUnit, setTimeUnit] = useState("d");
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [clubSaleTimeUnit, setClubSaleTimeUnit] = useState("m");

  let playerSaleTotalProperties = {
    h: "player_sale_total_per_hour",
    d: "player_sale_total_per_day",
    w: "player_sale_total_per_week",
    m: "player_sale_total_per_month",
  };

  const getData = (pursue, beforeListingId) => {
    setIsLoading(true);
    setData(null);

    getMarketplaceData({
      handleSuccess: (v) => {
        setData(v.data);
        setIsLoading(false);
      },
      params: {
        playerSaleTotalProperty: playerSaleTotalProperties[timeUnit],
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [timeUnit]);

  return (
    <div id="PageDashMarketplace" className="h-100 w-100">
      <div className="container container-xl h-100 w-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100 fade-in">
          <div className="d-flex flex-column flex-md-row flex-md-basis-300">
            <div
              className="card d-flex flex-column flex-md-basis-300 m-2 p-3 pt-2"
              style={{ minWidth: "280px" }}
            >
              <div className="d-flex flex-row flex-md-grow-1">
                <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center py-4 py-md-0">
                  <Count
                    label="Total player volume"
                    count={
                      data && data.getPlayerSaleTotal
                        ? "$" +
                          data.getPlayerSaleTotal
                            .reduce((acc, item) => acc + item.value, 0)
                            .toFixed(0)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            <div className="card d-flex flex-fill flex-basis-0 m-2 p-3 pt-2">
              <BoxMflActivity />
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row flex-md-grow-1">
            <div className="card d-flex flex-md-grow-1 flex-md-shrink-1 flex-md-basis-50p flex-basis-0 m-2 p-3 pt-2">
              <div className="d-flex flex-column">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Player sale volume</h4>
                </div>

                <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "h" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("h")}
                  >
                    H
                  </button>
                  <button
                    className={
                      "btn btn-small" +
                      (timeUnit === "d" ? " btn-info text-white" : " text-info")
                    }
                    onClick={() => setTimeUnit("d")}
                  >
                    D
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
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                <ChartBarSaleVolume data={data?.getPlayerSaleTotal} />
              </div>
            </div>

            <div className="card d-flex flex-md-grow-1 flex-md-shrink-1 flex-md-basis-50p m-2 p-3 pt-2">
              <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                <div className="d-flex flex-column flex-fill">
                  <div className="d-flex flex-grow-0">
                    <h4 className="flex-grow-1">Club sales</h4>
                  </div>

                  <div className="d-flex flex-column flex-fill flex-grow-0 flex-md-row justify-content-end align-items-end">
                    <ControllerDivisionsForChart
                      selectedDivisions={selectedDivisions}
                      onChange={(v) => setSelectedDivisions(v)}
                    />
                    <div className="d-flex flex-row ms-md-2 border rounded-2">
                      <button
                        className={
                          "btn btn-small" +
                          (clubSaleTimeUnit === "w"
                            ? " btn-info text-white"
                            : " text-info")
                        }
                        onClick={() => setClubSaleTimeUnit("w")}
                      >
                        W
                      </button>
                      <button
                        className={
                          "btn btn-small" +
                          (clubSaleTimeUnit === "m"
                            ? " btn-info text-white"
                            : " text-info")
                        }
                        onClick={() => setClubSaleTimeUnit("m")}
                      >
                        M
                      </button>
                      <button
                        className={
                          "btn btn-small" +
                          (clubSaleTimeUnit === "q"
                            ? " btn-info text-white"
                            : " text-info")
                        }
                        onClick={() => setClubSaleTimeUnit("q")}
                      >
                        Q
                      </button>
                      <button
                        className={
                          "btn btn-small" +
                          (clubSaleTimeUnit === "y"
                            ? " btn-info text-white"
                            : " text-info")
                        }
                        onClick={() => setClubSaleTimeUnit("y")}
                      >
                        Y
                      </button>
                      <button
                        className={
                          "btn btn-small" +
                          (clubSaleTimeUnit === "*"
                            ? " btn-info text-white"
                            : " text-info")
                        }
                        onClick={() => setClubSaleTimeUnit("*")}
                      >
                        ALL
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-fill flex-grow-1 overflow-hidden ratio-sm ratio-sm-4x3">
                    <ChartScatterClubSales
                      sales={data?.getClubSales}
                      timeUnit={clubSaleTimeUnit}
                      divisions={selectedDivisions}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default PageDashMarketplace;
