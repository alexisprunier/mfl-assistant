import React from 'react';
import Count from "./Count.js";

interface Player {
  id: number;
}

interface CountContractsProps {
  players: Player[];
}

const CountContracts: React.FC<CountContractsProps> = ({ players }) => {
  return (
    <Count
    	label="Loaded contracts"
    	count={players?.length}
    />
  );
};

export default CountContracts;