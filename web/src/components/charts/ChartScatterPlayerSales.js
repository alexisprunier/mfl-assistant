import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
import { Scatter } from "react-chartjs-2";
import {
  divisions,
  getDivisionColor,
  getDivisionName,
} from "utils/division.js";
import LoadingSquare from "components/loading/LoadingSquare";
import BoxMessage from "components/box/BoxMessage";
import { computeLinearRegression } from "utils/chart.js";
import { substractDate, addDate } from "utils/date.js";

interface Sale {
  id: number;
}

interface ChartScatterPlayerSalesProps {
  sales: Sale[];
  timeUnit: String;
  hideOneAndLower: boolean;
}

const ChartScatterPlayerSales: React.FC<ChartScatterPlayerSalesProps> = ({
  sales,
  timeUnit,
  hideOneAndLower,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const computeData = () => {
    let data = sales;

    if (hideOneAndLower) {
      data = data.filter((d) => d.price > 1);
    }

    data = data
      .filter((d) => startDate < d.executionDate < endDate)
      .map((d) => ({
        ...d,
        x: d.executionDate,
        y: d.price,
      }));

    return {
      data,
    };
  };

  const extendLeft = () => {
    setStartDate(substractDate(startDate, timeUnit));
  };

  const extendRight = () => {
    setEndDate(addDate(endDate, timeUnit));
  };

  const moveLeft = () => {
    setStartDate(substractDate(startDate, timeUnit));
    setEndDate(substractDate(endDate, timeUnit));
  };

  const moveRight = () => {
    setStartDate(addDate(startDate, timeUnit));
    setEndDate(addDate(endDate, timeUnit));
  };

  useEffect(() => {
    if (sales) {
      setStartDate(substractDate(new Date(), timeUnit));
      setEndDate(new Date());
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }, [sales, timeUnit]);

  return (
    <div className="h-100 w-100 position-relative">
      {!sales && <LoadingSquare />}

      {sales && sales.length === 0 && <BoxMessage content="No sale found" />}

      {sales && sales.length > 0 && (
        <div className="h-100 w-100">
          <div className="position-absolute top-0 start-0">
            <button className={"btn btn-small"} onClick={extendLeft}>
              <i className="bi bi-arrow-bar-left text-info"></i>
            </button>
            <button className={"btn btn-small"} onClick={moveLeft}>
              <i className="bi bi-caret-left-fill text-info"></i>
            </button>
          </div>
          <div className="position-absolute top-0 end-0">
            <button className={"btn btn-small"} onClick={moveRight}>
              <i className="bi bi-caret-right-fill text-info"></i>
            </button>
            <button className={"btn btn-small"} onClick={extendRight}>
              <i className="bi bi-arrow-bar-right text-info"></i>
            </button>
          </div>

          <Scatter
            data={{
              datasets: [
                {
                  ...computeData(),
                  pointBackgroundColor: "#0dcaf0",
                  pointBorderWidth: 0,
                  pointRadius: 5,
                  pointHoverRadius: 8,
                },
              ],
            }}
            options={{
              animation: {
                easing: "easeOutExpo",
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: ["w", "m"].indexOf(timeUnit) >= 0 ? "day" : "month",
                  },
                  adapters: {
                    date: {
                      locale: enUS,
                    },
                  },
                  min: startDate,
                  max: endDate,
                  position: "bottom",
                  title: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    /*stepSize: 1,
                    callback: function(val, index) {
                      return getDivisionName(val);
                    },*/
                  },
                  type: "linear",
                  position: "left",
                  beginAtZero: true,
                  title: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              layout: {
                padding: {
                  top: 40,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                datalabels: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function (point) {
                      var label = [];
                      label.push(`Price: ${point.raw.y}`);
                      label.push(`Date: ${point.raw.x}`);
                      label.push(``);
                      label.push(
                        `${point.raw.player.firstName} ${point.raw.player.lastName}`
                      );
                      label.push(
                        `OVR: ${point.raw.overall} - Age: ${point.raw.age}`
                      );
                      label.push(`Positions: ${point.raw.positions.join(",")}`);
                      label.push(``);

                      return label;
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChartScatterPlayerSales;
