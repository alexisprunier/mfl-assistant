import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import LoadingSquare from "components/loading/LoadingSquare";
import { sortDataset, fillMonthlyDataset } from "utils/chart.js";
import { unixTimestampToMonthString } from "utils/date.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);

interface ChartBarKeyCountProps {
  data?: object;
  onBarClick?: (data: any) => void;
}

const ChartBarKeyCount: React.FC<ChartBarKeyCountProps> = ({
  data,
  onBarClick,
}) => {
  const getData = () => {
    return {
      labels: data.sort((a, b) => a.key - b.key).map((d) => d.key),
      datasets: [
        {
          data: data.sort((a, b) => a.key - b.key).map((d) => d.count),
          backgroundColor: "#0dcaf0",
        },
      ],
    };
  };

  return (
    <div className="h-100 w-100">
      {!data ? (
        <LoadingSquare />
      ) : (
        <Bar
          data={getData()}
          options={{
            onClick: (event, elements) => {
              if (elements.length > 0 && onBarClick) {
                const chartElement = elements[0];
                const index = chartElement.index;
                const clickedData = data.sort((a, b) => a.key - b.key)[index];
                onBarClick(clickedData);
              }
            },
            onHover: (event, chartElement) => {
              event.native.target.style.cursor =
                chartElement.length && onBarClick ? "pointer" : "default";
            },
            responsive: true,
            maintainAspectRatio: false,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                anchor: "end",
                align: "end",
                color: "rgb(173, 181, 189)",
                font: {
                  weight: "bold",
                  size: 16,
                },
                formatter: (val) => (val > 0 ? val : ""),
              },
            },
            scales: {
              x: {
                ticks: {
                  beginAtZero: true,
                },
                title: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                ticks: {
                  display: false,
                },
                title: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ChartBarKeyCount;
