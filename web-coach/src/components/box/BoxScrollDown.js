import React from 'react';
import "./BoxScrollDown.css";

interface BoxScrollDownProps {}

const BoxScrollDown: React.FC < BoxScrollDownProps > = () => {
  return (
    <div
      className="BoxScrollDown"
      style={{ zIndex: 200 }}
    >
      <div className="text-white">
        <i className="h1 bi bi-arrow-down-square-fill"></i>
      </div>
    </div>
  );
};

export default BoxScrollDown;