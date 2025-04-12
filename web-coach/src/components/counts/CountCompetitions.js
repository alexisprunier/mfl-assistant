import React from 'react';
import Count from "./Count.js";

interface Competition {
  id: number;
}

interface CountCompetitionsProps {
  label?: string;
  competitions: Competition[];
}

const CountCompetitions: React.FC<CountCompetitionsProps> = ({ label, competitions }) => {
  return (
    <Count
    	label={label || "Competitions"}
    	count={competitions
        ? competitions.map((c) => ({
            name: c.root?.name ? c.root.name : c.name,
            startingDate: c.startingDate,
            type: c.type,
          }))
          .reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.startingDate === current.startingDate)) {
              accumulator.push(current);
            }
            return accumulator;
          }, [])
          .length
        : undefined
      }
    />
  );
};

export default CountCompetitions;