import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { sortDataset, fillMonthlyDataset } from "utils/chart.js";
import { unixTimestampToMonthString } from "utils/date.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ChartDataLabels
);

interface ChartBarClubsPerOwnerProps {
  data ? : object;
}

const ChartBarClubsPerOwner: React.FC < ChartBarClubsPerOwnerProps > = ({ data }) => {

  const getData = () => {
    const keys = data.map(item => parseInt(item.key, 10));
    const minKey = Math.min(...keys);
    const maxKey = Math.max(...keys);

    for (let i = minKey; i <= maxKey; i++) {
      if (keys.indexOf(i) < 0) {
        data.push({ "key": i.toString(), "count": 0 });
      }
    }

    return {
      labels: data.sort((a, b) => a.key - b.key).map((d) => d.key + " club" + (d.key === "1" ? "" : "s")),
      datasets: [{
        data: data.sort((a, b) => a.key - b.key).map((d) => d.count),
        backgroundColor: "#0dcaf0",
      }],
    };
  };

  return (
    <div className="h-100 w-100">
      {!data
        ? <LoadingSquare />
        : <Bar
          data={getData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                anchor: 'end',
                align: 'end',
                color: 'rgb(173, 181, 189)',
                font: {
                  weight: 'bold',
                  size: 16,
                },
                formatter: (val) => (val > 0 ? val : '')
              }
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
            layout: {
              padding: {
                top: 30,
              }
            }
          }}
        />
      }
    </div>
  );
};

export default ChartBarClubsPerOwner;