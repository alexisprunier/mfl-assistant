import React, { useState } from "react";

interface ControllerMatchTypeProps {
  selectedCriteria: string[];
  onChange: func;
}

const ControllerMatchType: React.FC<ControllerMatchTypeProps> = ({
  selectedCriteria,
  onChange,
}) => {
  const [criteria, setCriteria] = useState(["LEAGUE", "CUP", "FRIENDLY"]);

  const onClick = (p) => {
    onChange(p);
  };

  return (
    <div className="d-flex flex-row border rounded-2">
      {criteria.map((c) => (
        <button
          className={"btn btn-small"}
          onClick={() =>
            onClick(
              selectedCriteria.includes(c)
                ? selectedCriteria.filter((m) => m !== c)
                : selectedCriteria.concat([c])
            )
          }
          style={
            selectedCriteria && selectedCriteria.includes(c)
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

export default ControllerMatchType;
