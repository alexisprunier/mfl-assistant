import React from 'react';
import Count from "./Count.js";

interface Player {
  id: number;
}

interface CountContractRevenueShareProps {
  players: Player[];
}

const CountContractRevenueShare: React.FC<CountContractRevenueShareProps> = ({ players }) => {
  return (
    <Count
    	label="Rev. share"
    	count={players
        ? parseInt(
          players
            .map((t) => t.activeContract.revenueShare)
            .reduce((a, b) => a + b, 0)
            / 100
          ) + "%"
        : undefined
      }
    />
  );
};

export default CountContractRevenueShare;