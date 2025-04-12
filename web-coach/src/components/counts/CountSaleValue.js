import React from 'react';
import Count from "./Count.js";

interface Sale {
  id: number;
}

interface CountSalesProps {
  sales: Sale[];
}

const CountSales: React.FC<CountSalesProps> = ({ sales }) => {
  return (
    <Count
    	label="Sale value"
    	count={sales
        ? "$" + sales.map((t) => t.price)
    	    .reduce((a, b) => a + b, 0)
        : undefined}
    />
  );
};

export default CountSales;