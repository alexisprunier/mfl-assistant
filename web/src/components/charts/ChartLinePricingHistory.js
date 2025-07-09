import React from "react";
import { Line } from "react-chartjs-2";
import LoadingSquare from "components/loading/LoadingSquare";
import { Chart as ChartJS, CategoryScale, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, TimeScale);

interface ChartLinePricingHistoryProps {
  data: object;
}

const ChartLinePricingHistory: React.FC<ChartLinePricingHistoryProps> = ({
  data,
}) => {
  const getData = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 30);

    const filteredData = data
      .filter((d) => new Date(d.date) >= sevenDaysAgo)
      .map((d) => ({
        x: new Date(d.date),
        y: d.price,
      }));

    return {
      datasets: [
        {
          fill: true,
          borderColor: "#0dcaf0",
          backgroundColor: "rgba(13,202,240,.4)",
          data: filteredData,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    scales: {
      x: {
        type: "time",
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        time: {
          unit: "day",
          tooltipFormat: "dd-MM",
          displayFormats: {
            day: "dd-MM",
            month: "MMM yyyy",
          },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          maxTicksLimit: 5,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="h-100 w-100">
      {!data ? <LoadingSquare /> : <Line data={getData()} options={options} />}
    </div>
  );
};

export default ChartLinePricingHistory;
