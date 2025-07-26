import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import LoadingSquare from "components/loading/LoadingSquare";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);

interface ChartLineUserCountProps {
  data?: {
    getClubUserData: { date: string, value: number }[],
    getPlayerUserData: { date: string, value: number }[],
  };
}

const ChartLineUserCount: React.FC<ChartLineUserCountProps> = ({ data }) => {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);

  const mergedDates = data
    ? Array.from(
        new Set([...data.getClubUserData.map((d) => d.date), ...data.getPlayerUserData.map((d) => d.date)])
      ).sort()
    : [];

  const getData = () => {
    const slicedDates = mergedDates.slice(startPosition ?? 0, endPosition ?? mergedDates.length);
    return {
      labels: slicedDates,
      datasets: [
        {
          label: "Users with club",
          data: slicedDates.map((date) => {
            const found = data?.getClubUserData.find((d) => d.date === date);
            return found ? found.value : null;
          }),
          borderColor: "#0dcaf0",
          backgroundColor: "#0dcaf0",
          fill: false,
          tension: 0.3,
        },
        {
          label: "Users with player",
          data: slicedDates.map((date) => {
            const found = data?.getPlayerUserData.find((d) => d.date === date);
            return found ? found.value : null;
          }),
          borderColor: "white",
          backgroundColor: "white",
          fill: false,
          tension: 0.3,
        },
      ],
    };
  };

  const extendLeft = () => setStartPosition(Math.max(0, (startPosition ?? 0) - 6));
  const extendRight = () => setEndPosition(Math.min(mergedDates.length, (endPosition ?? 0) + 6));
  const moveLeft = () => {
    let positionsToMove = Math.min(startPosition ?? 0, ((endPosition ?? 0) - (startPosition ?? 0)) / 2);
    setStartPosition((startPosition ?? 0) - positionsToMove);
    setEndPosition((endPosition ?? 0) - positionsToMove);
  };
  const moveRight = () => {
    let positionsToMove = Math.min(
      mergedDates.length - (endPosition ?? 0),
      ((endPosition ?? 0) - (startPosition ?? 0)) / 2
    );
    setStartPosition((startPosition ?? 0) + positionsToMove);
    setEndPosition((endPosition ?? 0) + positionsToMove);
  };

  useEffect(() => {
    if (mergedDates.length > 0) {
      const today = new Date(mergedDates[mergedDates.length - 1]);
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - 30);

      const startIndex = mergedDates.findIndex((d) => new Date(d) >= pastDate);
      setStartPosition(startIndex >= 0 ? startIndex : 0);
      setEndPosition(mergedDates.length);
    } else {
      setStartPosition(null);
      setEndPosition(null);
    }
  }, [data]);

  return (
    <div className="h-100 w-100 position-relative">
      {!data ? (
        <LoadingSquare />
      ) : (
        <div className="h-100 w-100 position-relative">
          {/* Left controls */}
          <div className="position-absolute top-0 start-0" style={{ zIndex: 10 }}>
            <button className={"btn btn-small" + (startPosition === 0 ? " invisible" : "")} onClick={extendLeft}>
              <i className="bi bi-arrow-bar-left text-info"></i>
            </button>
            <button className={"btn btn-small" + (startPosition === 0 ? " invisible" : "")} onClick={moveLeft}>
              <i className="bi bi-caret-left-fill text-info"></i>
            </button>
          </div>

          {/* Right controls */}
          <div className="position-absolute top-0 end-0" style={{ zIndex: 10 }}>
            <button
              className={"btn btn-small" + (endPosition === mergedDates.length ? " invisible" : "")}
              onClick={moveRight}
            >
              <i className="bi bi-caret-right-fill text-info"></i>
            </button>
            <button
              className={"btn btn-small" + (endPosition === mergedDates.length ? " invisible" : "")}
              onClick={extendRight}
            >
              <i className="bi bi-arrow-bar-right text-info"></i>
            </button>
          </div>

          {/* Chart with top padding so buttons don’t overlap */}
          <div>
            <Line
              data={getData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  datalabels: {
                    anchor: "end",
                    align: "end",
                    color: "rgb(173, 181, 189)",
                    font: { weight: "bold", size: 14 },
                  },
                },
                scales: {
                  x: { ticks: { beginAtZero: true }, grid: { display: false } },
                  y: { grid: { display: false }, ticks: { display: false } },
                },
                layout: { padding: { top: 30 } },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartLineUserCount;
