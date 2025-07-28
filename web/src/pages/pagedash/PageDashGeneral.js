import React, { useState, useEffect } from "react";
import Count from "components/counts/Count.js";
import { getMarketplaceData, getUserData } from "services/api-assistant.js";
import ControllerDivisionsForChart from "components/controllers/ControllerDivisionsForChart.js";
import ChartBarSaleVolume from "components/charts/ChartBarSaleVolume.js";
import ChartScatterClubSales from "components/charts/ChartScatterClubSales.js";
import ChartLineUserCount from "components/charts/ChartLineUserCount.js";
import BoxCard from "components/box/BoxCard.js";

interface PageDashGeneralProps {}

const PageDashGeneral: React.FC<PageDashGeneralProps> = ({}) => {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [timeUnit, setTimeUnit] = useState("d");
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [clubSaleTimeUnit, setClubSaleTimeUnit] = useState("m");

  let playerSaleTotalProperties = {
    h: "player_sale_total_per_hour",
    d: "player_sale_total_per_day",
    w: "player_sale_total_per_week",
    m: "player_sale_total_per_month",
  };

  const fetchData = (pursue, beforeListingId) => {
    setData(null);

    getMarketplaceData({
      handleSuccess: (v) => {
        setData(v.data);
      },
      params: {
        playerSaleTotalProperty: playerSaleTotalProperties[timeUnit],
      },
    });
  };

  const fetchUserData = () => {
    setUserData(null);

    getUserData({
      handleSuccess: (v) => {
        setUserData(v.data);
      },
    });
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [timeUnit]);

  return (
    <div id="PageDashGeneral" className="h-100 w-100">
      <div className="container container-xl h-100 w-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100">
          <BoxCard title={"User base"} />

          <div className="d-flex flex-column flex-md-row mb-4">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard
                content={
                  <Count
                    label="Users with club"
                    count={
                      userData && userData.getClubUserData
                        ? userData?.getClubUserData?.[userData.getClubUserData.length - 1].value ?? null
                        : null
                    }
                  />
                }
              />
              <BoxCard
                content={
                  <Count
                    label="Users with player"
                    count={
                      userData && userData.getPlayerUserData
                        ? userData?.getPlayerUserData?.[userData.getPlayerUserData.length - 1].value ?? null
                        : null
                    }
                  />
                }
              />
            </div>

            <BoxCard
              className={"d-flex flex-fill"}
              title={"Users over time"}
              content={
                <div className="d-flex flex-fill ratio ratio-16x9">
                  <ChartLineUserCount data={userData} />
                </div>
              }
            />
          </div>

          <BoxCard title={"Marketplace activity"} />

          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard
                content={
                  <Count
                    label="Total player volume"
                    count={
                      data && data.getPlayerSaleTotal
                        ? "$" + data.getPlayerSaleTotal.reduce((acc, item) => acc + item.value, 0).toFixed(0)
                        : null
                    }
                  />
                }
              />
            </div>

            <BoxCard
              className={"d-flex flex-fill"}
              title={"Player sale volume"}
              actions={
                <div>
                  <button
                    className={"btn btn-small" + (timeUnit === "h" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("h")}
                  >
                    H
                  </button>
                  <button
                    className={"btn btn-small" + (timeUnit === "d" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("d")}
                  >
                    D
                  </button>
                  <button
                    className={"btn btn-small" + (timeUnit === "m" ? " btn-info text-white" : " text-info")}
                    onClick={() => setTimeUnit("m")}
                  >
                    M
                  </button>
                </div>
              }
              content={
                <div className="d-flex flex-fill ratio ratio-16x9">
                  <ChartBarSaleVolume data={data?.getPlayerSaleTotal} />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDashGeneral;
