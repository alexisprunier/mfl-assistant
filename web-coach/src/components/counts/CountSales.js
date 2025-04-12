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
    	label="Sales"
    	count={sales?.length}
    />
  );
};

export default CountSales;