import React, { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import LoadingSquare from "components/loading/LoadingSquare";
import "gantt-task-react/dist/index.css";
import { unixTimestampToDayString } from "utils/date.js";

interface Competition {
  id: number;
}

interface ChartGanttCompetitionsProps {
  competitions: Competition[];
}

const ChartGanttCompetitions: React.FC<ChartGanttCompetitionsProps> = ({
  competitions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const computeData = () => {
    return competitions
      .map((c) => ({
        name: c.root?.name ? c.root.name : c.name,
        startingDate: c.startingDate,
        type: c.type,
      }))
      .reduce((accumulator, current) => {
        if (isExpanded) {
          if (
            !accumulator.find(
              (item) =>
                item.name === current.name &&
                item.startingDate === current.startingDate
            )
          ) {
            accumulator.push(current);
          }
        } else {
          if (
            !accumulator.find(
              (item) =>
                item.type === current.type &&
                (item.startingDate === current.startingDate ||
                  (current.type === "LEAGUE" &&
                    unixTimestampToDayString(item.startingDate) ===
                      unixTimestampToDayString(current.startingDate)))
            )
          ) {
            accumulator.push(current);
          }
        }
        return accumulator;
      }, [])
      .sort((a, b) => (a.startingDate > b.startingDate ? 1 : -1))
      .map((c, i) => ({
        id: i,
        name: isExpanded || c.type === "CUP" ? c.name : c.type,
        start: new Date(c.startingDate),
        end: new Date(c.startingDate + 100000000),
        styles: {
          backgroundColor: c.type === "CUP" ? "#f86285" : "#adb5bd",
        },
      }));
  };

  const config = {
    todayColor: "red",
    rowHeight: 18,
  };

  return (
    <div className="mb-4 py-2 px-1 px-md-3">
      <div />
      <div className="w-100">
        {!competitions ? (
          <div className="ratio ratio-16x9">
            <LoadingSquare />
          </div>
        ) : (
          <div>
            <div className="text-end">
              <small>
                Expand all
                <input
                  type="checkbox"
                  className="ms-1"
                  value={isExpanded}
                  onChange={() => setIsExpanded(!isExpanded)}
                />
              </small>
            </div>
            <div className="border border-body">
              <Gantt
                tasks={computeData()}
                config={config}
                viewMode={ViewMode.Week}
                listCellWidth={""}
                allowSorting={true}
                {...config}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartGanttCompetitions;
