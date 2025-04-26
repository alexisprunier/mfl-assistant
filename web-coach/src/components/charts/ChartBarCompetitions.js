import React from "react";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import LoadingSquare from "components/loading/LoadingSquare";
import { sortDataset, fillMonthlyDataset } from "utils/chart.js";
import { unixTimestampToMonthString } from "utils/date.js";

interface Competition {
  id: number;
}

interface ChartLineCompetitionsProps {
  competitions: Competition[];
}

const ChartLineCompetitions: React.FC<ChartLineCompetitionsProps> = ({
  competitions,
}) => {
  const computeData = () => {
    const data = {};

    const cleanedCompetitions = competitions
      .map((c) => ({
        name: c.root?.name ? c.root.name : c.name,
        startingDate: c.startingDate,
        type: c.type,
      }))
      .reduce((accumulator, current) => {
        if (
          !accumulator.find(
            (item) => item.startingDate === current.startingDate
          )
        ) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);

    for (let i = 0; i < cleanedCompetitions.length; i++) {
      let month = unixTimestampToMonthString(
        cleanedCompetitions[i].startingDate
      );

      if (!data[month]) {
        data[month] = 1;
      } else {
        data[month] += 1;
      }
    }

    return sortDataset(fillMonthlyDataset(data));
  };

  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
        {!competitions ? (
          <LoadingSquare />
        ) : (
          <Bar
            data={{
              labels: [],
              datasets: [
                {
                  data: computeData(),
                  fill: false,
                  backgroundColor: "#f86285",
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
                    beginAtZero: true,
                  },
                  time: {
                    unit: "month",
                  },
                  title: {
                    display: true,
                    text: "Month",
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
                    text: "Competition",
                  },
                  grid: {
                    color: "#333",
                  },
                  border: {
                    color: "#333",
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChartLineCompetitions;
