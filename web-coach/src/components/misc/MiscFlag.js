import React from 'react';

interface MiscFlagProps {
  country: string;
}

const MiscFlag: React.FC < MiscFlagProps > = ({ country }) => {
  return (
    <img
      style={{height: 14}}
      src={`https://app.playmfl.com/img/flags/${country}.svg`}
    />
  );
};

export default MiscFlag;