import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import BoxMessage from "components/box/BoxMessage";
import LoadingSquare from "components/loading/LoadingSquare";
import { enUS } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { addDate, substractDate } from "utils/date.js";

ChartJS.register(annotationPlugin);

interface Sale {
  id: number;
}

interface ChartScatterPlayerSalesProps {
  sales: Sale[];
  timeUnit: string;
  hideOneAndLower: boolean;
  floor?: number;
}

const ChartScatterPlayerSales: React.FC<ChartScatterPlayerSalesProps> = ({
  sales,
  timeUnit,
  hideOneAndLower,
  floor,
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

    return { data };
  };

  const extendLeft = () =>
    setStartDate((prev) => prev && substractDate(prev, timeUnit));
  const extendRight = () =>
    setEndDate((prev) => prev && addDate(prev, timeUnit));
  const moveLeft = () => {
    setStartDate((prev) => prev && substractDate(prev, timeUnit));
    setEndDate((prev) => prev && substractDate(prev, timeUnit));
  };
  const moveRight = () => {
    setStartDate((prev) => prev && addDate(prev, timeUnit));
    setEndDate((prev) => prev && addDate(prev, timeUnit));
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
            <button className="btn btn-small" onClick={extendLeft}>
              <i className="bi bi-arrow-bar-left text-info"></i>
            </button>
            <button className="btn btn-small" onClick={moveLeft}>
              <i className="bi bi-caret-left-fill text-info"></i>
            </button>
          </div>
          <div className="position-absolute top-0 end-0">
            <button className="btn btn-small" onClick={moveRight}>
              <i className="bi bi-caret-right-fill text-info"></i>
            </button>
            <button className="btn btn-small" onClick={extendRight}>
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
              animation: { easing: "easeOutExpo" },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: ["w", "m"].includes(timeUnit) ? "day" : "month",
                  },
                  adapters: { date: { locale: enUS } },
                  min: startDate,
                  max: endDate,
                  position: "bottom",
                  title: { display: false },
                  grid: { display: false },
                },
                y: {
                  type: "linear",
                  position: "left",
                  beginAtZero: true,
                  title: { display: false },
                  grid: { display: false },
                },
              },
              layout: { padding: { top: 40 } },
              plugins: {
                legend: { display: false },
                datalabels: { display: false },
                tooltip: {
                  callbacks: {
                    label: (point) => [
                      `Price: ${point.raw.y}`,
                      `Date: ${point.raw.x}`,
                      "",
                      `${point.raw.player.firstName} ${point.raw.player.lastName}`,
                      `OVR: ${point.raw.overall} - Age: ${point.raw.age}`,
                      `Positions: ${point.raw.positions.join(",")}`,
                      "",
                    ],
                  },
                },
                annotation: {
                  annotations: floor
                    ? {
                        floorLine: {
                          type: "line",
                          scaleID: "y",
                          value: floor,
                          borderColor: "#0dcaf0",
                          borderWidth: 2,
                          borderDash: [6, 6],
                          label: {
                            display: true,
                            content: "Floor price",
                            position: "start",
                            color: "#ffffff",
                            font: {
                              weight: "bold",
                              size: 9,
                            },
                            backgroundColor: "#0dcaf0",
                            padding: { top: 2, bottom: 2, left: 4, right: 4 },
                          },
                        },
                      }
                    : {},
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
