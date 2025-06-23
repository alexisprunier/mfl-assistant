import React, { useState } from "react";

interface ControllerClubsProps {
  selectedCriteria: string[];
  onChange: func;
}

const ControllerClubs: React.FC<ControllerClubsProps> = ({
  clubs,
  selectedClubs,
  onChange,
}) => {
  const onClick = (p) => {
    onChange(p);
  };

  return (
    <div className="d-flex flex-row border rounded-2">
      {clubs.map((c) => (
        <button
          className={"btn btn-small py-1"}
          onClick={() =>
            onClick(
              selectedClubs.includes(c.id)
                ? selectedClubs.filter((m) => m !== c.id)
                : selectedClubs.concat([c.id])
            )
          }
          style={
            selectedClubs && selectedClubs.includes(c.id)
              ? { color: "white", backgroundColor: "#f86285" }
              : { color: "#f86285" }
          }
        >
          <img
            src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${c.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
            alt={`${c.name} logo`}
            style={{ height: "20px" }}
          />
        </button>
      ))}
    </div>
  );
};

export default ControllerClubs;
