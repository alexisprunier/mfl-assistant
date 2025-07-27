import React from "react";
import { divisions } from "utils/division.js";

interface ControllerDivisionsForChartProps {
  selectedDivisions: int[];
  onChange: func;
}

const ControllerDivisionsForChart: React.FC<ControllerDivisionsForChartProps> = ({ selectedDivisions, onChange }) => {
  const onClick = (p) => {
    let newSelectedDivisions = selectedDivisions;

    if (newSelectedDivisions.indexOf(p) >= 0) {
      newSelectedDivisions = newSelectedDivisions.filter((pos) => pos !== p);
    } else {
      newSelectedDivisions = newSelectedDivisions.concat([p]);
    }

    onChange(newSelectedDivisions);
  };

  return (
    <div className="d-flex flex-row border">
      {divisions
        .map((d) => (
          <button
            className={"btn btn-small"}
            onClick={() => onClick(d.number)}
            style={
              selectedDivisions && selectedDivisions.indexOf(d.number) >= 0
                ? { color: "white", backgroundColor: d.color }
                : { color: d.color }
            }
          >
            {d.number}
          </button>
        ))
        .reverse()}
    </div>
  );
};

export default ControllerDivisionsForChart;
