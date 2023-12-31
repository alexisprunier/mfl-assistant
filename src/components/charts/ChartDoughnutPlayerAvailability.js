import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";

interface ChartDoughnutPlayerAvailabilityProps {
  freeAgentCount?: number;
  total?: number;
}

const ChartDoughnutPlayerAvailability: React.FC<ChartDoughnutPlayerAvailabilityProps> = ({ freeAgentCount, total }) => {

  const getData = () => ({
    labels: ["Free agent", "Under contract"],
    datasets: [
      {
        backgroundColor: ["#0dcaf0", "#adb5bd"],
        data: [freeAgentCount, total - freeAgentCount]
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
	    position: 'bottom',
	  }
	},
  });

  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div className="ratio ratio-16x9 w-100">
        {(!freeAgentCount || !total)
          ? <LoadingSquare />
      	  : <Doughnut
      	  	data={getData()}
      	  	options={getOptions()}
      	  />
      	}
      </div>
    </div>
  );
};

export default ChartDoughnutPlayerAvailability;