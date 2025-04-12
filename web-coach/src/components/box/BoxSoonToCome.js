import React from 'react';
import { Link } from 'react-router-dom';

interface BoxSoonToComeProps {}

const BoxSoonToCome: React.FC < BoxSoonToComeProps > = ({}) => {
  return (
    <div className="BoxMessage w-100 h-100 py-3">
      <div className=" d-flex align-items-center justify-content-center w-100 h-100">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <i className="bi bi-cone-striped h3 mb-0"/>
          Soon to come!
        </div>
      </div>
    </div>
  );
};

export default BoxSoonToCome;