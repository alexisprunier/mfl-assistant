import React from 'react';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { sortDataset, fillMonthlyDataset } from "utils/chart.js";
import { unixTimestampToMonthString } from "utils/date.js";

interface Competition {
  id: number;
}

interface ChartLineCompetitionParticipationsProps {
  competitions: Competition[];
}

const ChartLineCompetitionParticipations: React.FC<ChartLineCompetitionParticipationsProps> = ({ competitions }) => {
  
  const computeData = () => {
    const data = {};

    for (let i = 0; i < competitions.length; i++) {
      let month = unixTimestampToMonthString(competitions[i].startingDate);

      if (!data[month]) {
        data[month] = competitions[i].nbParticipants;
      } else {
        data[month] += competitions[i].nbParticipants;
      }
    }

    return sortDataset(fillMonthlyDataset(data));
  }

  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
        {!competitions
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
                    beginAtZero: true,
                  },
                  title: {
                    display: true,
                    text: 'Month',
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
                    text: 'Participant',
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

export default ChartLineCompetitionParticipations;