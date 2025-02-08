import React, { useEffect, useState } from "react";
import {
  getPlayerPricings,
  getRawPlayerPricings,
} from "services/api-assistant.js";

interface PagePricingProps {
  yScrollPosition: number;
  props: object;
}

const PagePricing: React.FC<PagePricingProps> = (props) => {
  const [showRawPricings, setShowRawPricings] = useState(false);
  const [pricings, setPricings] = useState([]); // Store the pricing data
  const [rawPricings, setRawPricings] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("GK"); // Track selected position
  const [filteredPricings, setFilteredPricings] = useState([]); // Filtered pricings based on position

  const positions = [
    "GK",
    "RB",
    "LB",
    "CB",
    "RWB",
    "LWB",
    "CDM",
    "RM",
    "LM",
    "CM",
    "CAM",
    "RW",
    "LW",
    "CF",
    "ST",
  ]; // List of positions to choose from

  // Fetch pricing data
  const fetchPricings = () => {
    getPlayerPricings({
      handleSuccess: (d) => {
        if (d.data.getPlayerPricings) {
          setPricings(d.data.getPlayerPricings); // Set the fetched pricing data
        }
      },
      handleError: (e) => console.log(e),
    });
  };

  const fetchRawPricings = () => {
    getRawPlayerPricings({
      handleSuccess: (d) => {
        if (d.data.getRawPlayerPricings) {
          setRawPricings(d.data.getRawPlayerPricings); // Set the fetched pricing data
        }
      },
      handleError: (e) => console.log(e),
    });
  };

  // Handle position selection and filter data accordingly
  const handlePositionChange = (e) => {
    const position = e.target.value;
    setSelectedPosition(position);
  };

  // Filter pricings by the selected position
  const filterPricingsByPosition = (position) => {
    var filtered = null;
    if (showRawPricings) {
      filtered = rawPricings.filter((p) => p.position === position);
    } else {
      filtered = pricings.filter((p) => p.position === position);
    }

    setFilteredPricings(filtered); // Set the filtered pricings for the table
  };

  // UseEffect to fetch pricings when the component mounts
  useEffect(() => {
    fetchPricings();
    fetchRawPricings();
  }, []);

  useEffect(() => {
    console.log(selectedPosition);
    filterPricingsByPosition(selectedPosition);
  }, [pricings, selectedPosition, showRawPricings]);

  // Function to render the table
  const renderTable = () => {
    // Define the predefined set of ages and overalls
    const ages = Array.from({ length: 27 }, (_, i) => 16 + i); // Ages from 16 to 42
    const overalls = Array.from({ length: 63 }, (_, i) => 37 + i); // Overalls from 37 to 99

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Age</th>
            {overalls.map((ovr, index) => (
              <th key={index}>{ovr}</th> // Render overall values as table headers
            ))}
          </tr>
        </thead>
        <tbody>
          {ages.map((age, index) => (
            <tr key={index}>
              <td>{age}</td> {/* Render age in first column */}
              {overalls.map((ovr, ovrIndex) => {
                // Find the price for this age and overall combination
                const pricing = filteredPricings.find(
                  (p) => p.age === age && p.overall === ovr
                );
                return (
                  <td key={ovrIndex}>
                    {pricing ? pricing.price.toFixed(2) : "-"}{" "}
                    {/* Round price to 2 decimal places or display "-" if no pricing found */}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div id="PagePricing" className="w-100 h-100 mt-5 p-5">
      {/* Position Selector */}
      <div>
        <label>Select Position: </label>
        <select value={selectedPosition} onChange={handlePositionChange}>
          <option value="">-- Select Position --</option>
          {positions.map((position, index) => (
            <option key={index} value={position}>
              {position}
            </option>
          ))}
        </select>
        <input
          type="checkbox"
          defaultChecked={showRawPricings}
          onChange={(v) => setShowRawPricings(v.target.checked)}
        />
        Show raw value
      </div>

      {/* Render Table */}
      {selectedPosition && renderTable()}
    </div>
  );
};

export default PagePricing;
