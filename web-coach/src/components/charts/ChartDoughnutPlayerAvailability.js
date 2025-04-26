import React from "react";
import { Doughnut } from "react-chartjs-2";
import LoadingSquare from "components/loading/LoadingSquare";

interface ChartDoughnutPlayerAvailabilityProps {
  freeAgentCount?: number;
  total?: number;
}

const ChartDoughnutPlayerAvailability: React.FC<
  ChartDoughnutPlayerAvailabilityProps
> = ({ freeAgentCount, total }) => {
  const getData = () => ({
    labels: ["Free agent", "Under contract"],
    datasets: [
      {
        backgroundColor: ["#f86285", "#adb5bd"],
        data: [freeAgentCount, total - freeAgentCount],
      },
    ],
  });

  const getOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#AAA",
        },
        position: "bottom",
      },
    },
  });

  return (
    <div className="h-100 w-100">
      {!freeAgentCount || !total ? (
        <LoadingSquare />
      ) : (
        <Doughnut data={getData()} options={getOptions()} />
      )}
    </div>
  );
};

export default ChartDoughnutPlayerAvailability;
