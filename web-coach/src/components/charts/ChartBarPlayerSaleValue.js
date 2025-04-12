import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { sortDataset } from "utils/chart.js";
import { unixTimestampToDayString } from "utils/date.js";

interface Sale {
  id: number;
}

interface ChartBarPlayerSaleValueProps {
  sales: Sale[];
}

const ChartBarPlayerSaleValue: React.FC < ChartBarPlayerSaleValueProps > = ({ sales }) => {

  const computeData = () => {
    let data = {};

    for (let i = 0; i < sales.length; i++) {
      let day = unixTimestampToDayString(sales[i].purchaseDateTime);

      if (!data[day]) {
        data[day] = sales[i].price;
      } else {
        data[day] += sales[i].price;
      }
    }

    return sortDataset(data);
  }

  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
        {!sales
          ? <LoadingSquare />
          : <Bar
            data={{
              labels: [],
              datasets: [
                {
                  data: computeData(),
                  fill: false,
                  backgroundColor: "#0dcaf0",
                  lineTension: 0.3,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#AAA",
                  },
                  title: {
                    display: true,
                    text: 'Day',
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    color: "#AAA",
                  },
                  title: {
                    display: true,
                    text: 'Sale',
                  },
                  grid: {
                    color: '#333',
                  },
                  border: {
                    color: '#333',
                  },
                },
              },
            }}
          />
        }
      </div>
    </div>
  );
};

export default ChartBarPlayerSaleValue;