import React, { useState } from "react";
import { divisions } from "utils/division.js";

interface ControllerMflMatchTypeProps {
  selectedDivisions: int[];
  onChange: func;
}

const ControllerMflMatchType: React.FC<ControllerMflMatchTypeProps> = ({
  selectedCriteria,
  onChange,
}) => {
  const [criteria, setCriteria] = useState([
    "All",
    "Competitions",
    "Home friendlies",
  ]);

  const onClick = (p) => {
    onChange(p);
  };

  return (
    <div className="d-flex flex-row border rounded-2">
      {criteria.map((c) => (
        <button
          className={"btn btn-small"}
          onClick={() => onClick(c)}
          style={
            selectedCriteria && selectedCriteria == c
              ? { color: "white", backgroundColor: "#f86285" }
              : { color: "#f86285" }
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
};

export default ControllerMflMatchType;
