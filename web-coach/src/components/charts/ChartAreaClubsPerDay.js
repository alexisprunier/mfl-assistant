import React from 'react';
import { Line } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { divisions } from "utils/division.js";
import { Chart as ChartJS, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
);

interface ChartAreaClubsPerDayProps {
  data: object;
}

const ChartAreaClubsPerDay: React.FC < ChartAreaClubsPerDayProps > = ({ data }) => {

  const getData = () => ({
    labels: data.map((d) => d.date),
    datasets: [{
      fill: true,
      borderColor: "#0dcaf0",
      backgroundColor: "rgba(13,202,240,.4)",
      data: data.map((d) => d.value),
    }],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    scales: {
      x: {
        type: 'time',
        ticks: {
          beginAtZero: true,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
        },
        time: {
          unit: 'month',
          tooltipFormat: 'yyyy-MM-dd',
          displayFormats: {
            day: 'yyyy-MM-dd',
            month: 'MMM yyyy',
          },
        },
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: true,
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
        display: false
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="h-100 w-100">
      {!data
        ? <LoadingSquare />
        : <Line
          data={getData()}
          options={options}
        />
      }
    </div>
  );
};

export default ChartAreaClubsPerDay;