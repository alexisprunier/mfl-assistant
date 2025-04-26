import React, { useState } from "react";
import { divisions } from "utils/division.js";

interface ControllerPlayerCriteriaProps {
  selectedDivisions: int[];
  onChange: func;
}

const ControllerPlayerCriteria: React.FC<ControllerPlayerCriteriaProps> = ({
  selectedCriteria,
  onChange,
}) => {
  const [criteria, setCriteria] = useState(["OVR", "AGE", "POS"]);

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

export default ControllerPlayerCriteria;
