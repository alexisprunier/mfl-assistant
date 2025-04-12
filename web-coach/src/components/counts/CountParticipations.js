import React from 'react';
import Count from "./Count.js";

interface Competition {
  id: number;
}

interface CountCompetitionsProps {
  competitions: Competition[];
}

const CountCompetitions: React.FC<CountCompetitionsProps> = ({ competitions }) => {
  return (
    <Count
    	label="Participations"
    	count={competitions?.map((c) => c.nbParticipants)
    		.reduce((a, b) => a + b, 0)
    	}
    />
  );
};

export default CountCompetitions;