import React from 'react';
import { Bar } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { divisions } from "utils/division.js";
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ChartDataLabels
);

interface ChartBarClubsPerDivisionProps {
  data: object;
}

const ChartBarClubsPerDivision: React.FC < ChartBarClubsPerDivisionProps > = ({ data }) => {

  const getData = () => ({
    labels: divisions.map((d) => d.name),
    datasets: [{
      backgroundColor: divisions.map((d) => d.color),
      data: divisions
        .map((d) => {
          let r = data.filter((c) => c.key === d.number.toString()).pop();
          return r ? r.count : 0;
        }),
    }],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    barPercentage: 1.0,
    categoryPercentage: 1.0,
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false,
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
        anchor: 'end',
        align: 'end',
        color: 'rgb(173, 181, 189)',
        font: {
          weight: 'bold',
          size: 16,
        }
      }
    },
    layout: {
      padding: {
        top: 30,
      }
    }
  };

  return (
    <div className="h-100 w-100">
      {!data
        ? <LoadingSquare />
        : <Bar
          data={getData()}
          options={options}
        />
      }
    </div>
  );
};

export default ChartBarClubsPerDivision;