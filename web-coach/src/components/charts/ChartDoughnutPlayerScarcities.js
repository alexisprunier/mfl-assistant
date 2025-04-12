import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { scarcity } from "utils/player.js";

interface ChartDoughnutPlayerScarcitiesProps {
  scarcityCount ? : dict;
}

const ChartDoughnutPlayerScarcities: React.FC < ChartDoughnutPlayerScarcitiesProps > = ({ scarcityCount }) => {

  const getData = () => ({
    labels: Object.keys(scarcityCount),
    datasets: [{
      backgroundColor: scarcity.map((d) => d.color),
      data: Object.values(scarcityCount),
    }, ],
  });

  const getOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#AAA",
        },
        position: 'bottom',
      }
    },
  });

  return (
    <div className="h-100 w-100">
      {!scarcityCount
        ? <LoadingSquare />
        : <Doughnut
          data={getData()}
          options={getOptions()}
        />
      }
    </div>
  );
};

export default ChartDoughnutPlayerScarcities;