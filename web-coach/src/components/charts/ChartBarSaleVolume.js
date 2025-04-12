import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ChartDataLabels
);

interface ChartBarSaleVolumeProps {
  data ? : object;
}

const ChartBarSaleVolume: React.FC < ChartBarSaleVolumeProps > = ({ data }) => {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);

  const getData = () => {
    return {
      labels: data.slice(startPosition, endPosition).map((d) => d.date),
      datasets: [{
        data: data.slice(startPosition, endPosition).map((d) => d.value),
        backgroundColor: "#0dcaf0",
      }],
    };
  };

  const extendLeft = () => {
    setStartPosition(Math.max(0, startPosition - 6));
  }

  const extendRight = () => {
    setEndPosition(Math.min(data.length, endPosition + 6));
  }

  const moveLeft = () => {
    let positionsToMove = Math.min(startPosition, (endPosition - startPosition) / 2)
    setStartPosition(startPosition - positionsToMove);
    setEndPosition(endPosition - positionsToMove);
  }

  const moveRight = () => {
    let positionsToMove = Math.min(data.length - endPosition, (endPosition - startPosition) / 2)
    setStartPosition(startPosition + positionsToMove);
    setEndPosition(endPosition + positionsToMove);
  }

  useEffect(() => {
    if (data) {
      setStartPosition(Math.max(0, data.length - 12));
      setEndPosition(data.length);
    } else {
      setStartPosition(null);
      setEndPosition(null);
    }
  }, [data]);

  return (
    <div className="h-100 w-100 position-relative">
      {!data
        ? <LoadingSquare />
        : <div className="h-100 w-100">
        	<div className="position-absolute top-0 start-0">
        		<button className={"btn btn-small" + (startPosition === 0 ? " invisible": "")} onClick={extendLeft}>
        			<i className="bi bi-arrow-bar-left text-info"></i>
        		</button>
        		<button className={"btn btn-small" + (startPosition === 0 ? " invisible": "")} onClick={moveLeft}>
        			<i className="bi bi-caret-left-fill text-info"></i>
        		</button>
        	</div>
        	<div className="position-absolute top-0 end-0">
        		<button className={"btn btn-small" + (endPosition === data.length ? " invisible": "")} onClick={moveRight}>
        			<i className="bi bi-caret-right-fill text-info"></i>
        		</button>
        		<button className={"btn btn-small" + (endPosition === data.length ? " invisible": "")} onClick={extendRight}>
        			<i className="bi bi-arrow-bar-right text-info"></i>
        		</button>
        	</div>
        	<Bar
	          data={getData()}
	          options={{
	          	animation: {
                /*easing: "easeOutQuart",
                y: {from: 500}*/
              },
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
	                }
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
        </div>
      }
    </div>
  );
};

export default ChartBarSaleVolume;