import React from 'react';
import { divisions as clubDivisions } from "utils/division.js";

interface ControllerDivisionsProps {
  divisions: int[];
  onChange: func;
}

const ControllerDivisions: React.FC<ControllerDivisionsProps> = ({ divisions, onChange }) => {

  const onClick = (p) => {
    let newSelectedDivisions = divisions;

    if (newSelectedDivisions.indexOf(p) >= 0) {
      newSelectedDivisions = newSelectedDivisions.filter((pos) => pos !== p);
    } else {
      newSelectedDivisions = newSelectedDivisions.concat([p]);
    }

    onChange(newSelectedDivisions);
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <h4>Division</h4>
      </div>
      <div className="col-12">
      	{clubDivisions
          .map((p) => (
            <button
              key={p.number}
              className={"btn text-white w-100" + (divisions.indexOf(p.number) >= 0 ? " btn-info" : "")}
              onClick={() => onClick(p.number)}>
              {p.name}
            </button>
        ))}
      </div>
    </div>
  );
};

export default ControllerDivisions;