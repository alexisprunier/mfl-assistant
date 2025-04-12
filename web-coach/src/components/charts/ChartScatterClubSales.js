import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { Scatter } from 'react-chartjs-2';
import LoadingSquare from "components/loading/LoadingSquare";
import { getDivisionColor } from "utils/division.js";
import { substractDate, addDate } from "utils/date.js";

interface Sale {
  id: number;
}

interface ChartScatterClubSalesProps {
  sales: Sale[];
  timeUnit: str;
}

const ChartScatterClubSales: React.FC < ChartScatterClubSalesProps > = ({ sales, timeUnit, divisions }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const computeData = () => {
    const data = sales
      .filter((s) => startDate < s.executionDate < endDate)
      .filter((s) => !divisions || divisions.length === 0 || (s.club && divisions.indexOf(s.club.division) >= 0))
      .map((s) => ({
        x: s.executionDate,
        y: s.price,
        color: getDivisionColor(s.club ? s.club.division : null),
        ...s
      }));

    return {
      data,
      pointBackgroundColor: data.map((d) => d.color)
    }
  }

  const extendLeft = () => {
    setStartDate(substractDate(startDate, timeUnit));
  }

  const extendRight = () => {
    setEndDate(addDate(endDate, timeUnit));
  }

  const moveLeft = () => {
    setStartDate(substractDate(startDate, timeUnit));
    setEndDate(substractDate(endDate, timeUnit));
  }

  const moveRight = () => {
    setStartDate(addDate(startDate, timeUnit));
    setEndDate(addDate(endDate, timeUnit));
  }

  useEffect(() => {
    if (sales) {
      setStartDate(substractDate(new Date(), timeUnit));
      setEndDate(new Date());
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }, [sales, timeUnit]);

  return (
    <div className="h-100 w-100 position-relative">
      {!sales
        ? <LoadingSquare />
        : <div className="h-100 w-100">
          <div className="position-absolute top-0 start-0">
            <button className={"btn btn-small"} onClick={extendLeft}>
              <i className="bi bi-arrow-bar-left text-info"></i>
            </button>
            <button className={"btn btn-small"} onClick={moveLeft}>
              <i className="bi bi-caret-left-fill text-info"></i>
            </button>
          </div>
          <div className="position-absolute top-0 end-0">
            <button className={"btn btn-small"} onClick={moveRight}>
              <i className="bi bi-caret-right-fill text-info"></i>
            </button>
            <button className={"btn btn-small"} onClick={extendRight}>
              <i className="bi bi-arrow-bar-right text-info"></i>
            </button>
          </div>

          <Scatter
            data={{
              datasets: [
                {
                  ...computeData(),
                  pointBorderWidth: 0,
                  pointRadius: 5,
                  pointHoverRadius: 8,
                },
              ],
            }}
            options={{
              animation: {
                easing: "easeOutExpo"
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: {
                  },
                  type: "time",
                  time: {
                    unit: ["w", "m"].indexOf(timeUnit) >= 0 ? "day" : "month",
                  },
                  adapters: { 
                    date: {
                      locale: enUS, 
                    },
                  }, 
                  min: startDate,
                  max: endDate,
                  position: 'bottom',
                  title: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
                y:
                  {
                  ticks: {
                  },
                  type: 'linear',
                  position: 'left',
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
                  top: 40,
                }
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
                      label.push(`Price: ${point.raw.y}`);
                      label.push(`Date: ${point.raw.x}`);
                      label.push(``);
                      label.push(`${point.raw.club.name}`);
                      label.push(`${point.raw.club.country} - ${point.raw.club.city}`);
                      label.push(`Division: ${point.raw.club.division}`);
                      label.push(``);
                      return label;
                    }
                  }
                },
              },
            }}
          />
        </div>
      }
    </div>
  );
};

export default ChartScatterClubSales;