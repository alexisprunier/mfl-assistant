import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Scatter } from 'react-chartjs-2';
import { divisions, getDivisionColor, getDivisionName } from "utils/division.js";
import LoadingSquare from "components/loading/LoadingSquare";
import BoxMessage from "components/box/BoxMessage";
import { computeLinearRegression } from "utils/chart.js";

interface Player {
  id: number;

}

interface ChartScatterPlayerContractsProps {
  contracts: Contract[];
  hideZeros: boolean;
}

const ChartScatterPlayerContracts: React.FC < ChartScatterPlayerContractsProps > = ({ contracts, hideZeros }) => {

  const computeData = () => {
    let tempData = [];
    const data = [];

    for (let i = 0; i < contracts.length; i++) {
      tempData.push({
        x: contracts[i].revenueShare / 100,
        y: contracts[i].club.division,
        color: getDivisionColor(contracts[i].club.division),
      });
    }

    if (hideZeros) {
      tempData = tempData.filter((d) => d.x > 0);
    }

    while (tempData.length > 0) {
      let samePoints = tempData.filter((d) => d.x === tempData[0].x && d.y === tempData[0].y);

      data.push({
        ...tempData[0],
        count: samePoints.length,
      });

      tempData = tempData.filter((d) => d.x !== tempData[0].x || d.y !== tempData[0].y);
    }

    return {
      data,
      pointBackgroundColor: data.map((d) => d.color),
      pointRadius: data.map((d) => mapValue(d.count)),
      pointHoverRadius: data.map((d) => mapValue(d.count) + 4),
    };
  }

  const mapValue = (input) => {
    if (input < 1) {
      return 0;
    }

    const minOutput = 4;
    const maxOutput = 20;
    const base = 10;

    const logInput = Math.log(input) / Math.log(base);
    const scaledLog = minOutput + ((maxOutput - minOutput) * logInput / Math.log(base));
    const output = Math.max(minOutput, Math.min(scaledLog, maxOutput));

    return output;
  }

  return (
    <div className="h-100 w-100">
      {!contracts
        && <LoadingSquare />
      }

      {contracts && contracts.length === 0
        && <BoxMessage content="No contract found" />
      }

      {contracts && contracts.length > 0
        && <Scatter
          data={{
            datasets: [
              {
                ...computeData(),
                pointBorderWidth: 0,
              },
            ],
          }}
          options={{
            animation: {
              easing: "easeInOutBack"
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  stepSize: 1,
                  callback: function(val, index) {
                    return `${val}%`;
                  },
                },
                position: 'bottom',
                title: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                offset: true,
              },
              y: {
                reverse: true,
                ticks: {
                  stepSize: 1,
                  callback: function(val, index) {
                    return getDivisionName(val);
                  },
                },
                type: 'linear',
                position: 'left',
                title: {
                  display: false,
                },
                grid: {
                  display: false,
                },
                offset: true,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(point) {
                    var label = []
                    label.push(`Division: ${point.raw.y}`);
                    label.push(`Contract(s): ${point.raw.count}`);
                    label.push(`Rate: ${point.raw.x}`);
                    
                    return label;
                  }
                }
              }
            },
          }}
        />
      }
    </div>
  );
};

export default ChartScatterPlayerContracts;