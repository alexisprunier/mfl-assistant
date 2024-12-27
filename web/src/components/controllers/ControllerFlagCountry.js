import React from 'react';
import "./ControllerFlagCountry.css";
import MiscFlag from "components/misc/MiscFlag.js";

interface ControllerFlagCountryProps {
  countries: string[];
  selectedCountries: string[];
  onChange ? : func;
}

const ControllerFlagCountry: React.FC < ControllerFlagCountryProps > = ({ countries, selectedCountries, onChange }) => {

  const onClick = (p) => {
    if (onChange && selectedCountries) {
      if (selectedCountries.indexOf(p) >= 0) {
        onChange(selectedCountries.filter((c) => c !== p));
      } else {
        console.log([...selectedCountries, ...[p]])
        onChange([...selectedCountries, ...[p]]);
      }
    }
  };

  return (
    <div className="ControllerFlagCountry d-flex flex-row">
      {countries && countries.map((c) => (
        <div
          className={"mx-1 " + (selectedCountries.indexOf(c) >= 0 || selectedCountries.length === 0 ? "" : "disabled")}
          onClick={() => onClick(c)}
        >
          <MiscFlag
            key={c}
            country={c}
          />
        </div>
      ))}
    </div>
  );
};

export default ControllerFlagCountry;