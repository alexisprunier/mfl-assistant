import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import LoadingSquare from "components/loading/LoadingSquare";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(ChartDataLabels);

interface ChartBarPlayerAttributeDistributionProps {
  data?: Record<string, { key: string, count: number }[]>;
}

const ChartBarPlayerAttributeDistribution: React.FC<
  ChartBarPlayerAttributeDistributionProps
> = ({ data }) => {
  const attributes = ["OVR", "PAC", "DRI", "PAS", "SHO", "DEF", "PHY"];

  const getData = () => {
    return {
      labels: attributes,
      datasets: [
        {
          label: "Min",
          data: attributes.map((attr) => data[attr]?.min || 0),
          backgroundColor: "rgba(11, 202, 240, .1)",
        },
        {
          label: "Median",
          data: attributes.map((attr) => data[attr]?.median || 0),
          backgroundColor: "#0dcaf0",
        },
        {
          label: "Max",
          data: attributes.map((attr) => data[attr]?.max || 0),
          backgroundColor: "rgba(11, 202, 240, .1)",
        },
      ],
    };
  };

  return (
    <div className="h-100 w-100">
      {!data ? (
        <LoadingSquare />
      ) : (
        <Bar
          data={getData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            barPercentage: 1.0,
            categoryPercentage: 0.8,
            plugins: {
              legend: {
                display: false,
                position: "top",
              },
              datalabels: {
                anchor: "end",
                align: "end",
                color: "rgb(173, 181, 189)",
                font: {
                  weight: "bold",
                  size: 12,
                },
                formatter: (val) => (val > 0 ? val : ""),
              },
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
                top: 20,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ChartBarPlayerAttributeDistribution;
