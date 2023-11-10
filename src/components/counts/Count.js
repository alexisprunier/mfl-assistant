import React from 'react';
import "./Count.css";
import LoadingSquare from "components/loading/LoadingSquare.js";

interface CountProps {
  label?: string;
  count?: number;
}

const Count: React.FC<CountProps> = ({ label, count }) => {
  const getContent = () => {
    return (
      <div className="w-auto flex-column">
        {count
          ? <div className="count w-auto h1 lh-1 m-0">{ count }</div>
          : <LoadingSquare />
        }

        {label
          && <div className="label w-auto text-secondary lh-1 h5">
            { label }
          </div>}
      </div>
    );
  }

  return (
    <div className="Count d-flex justify-content-center pt-2 pb-5 py-md-5 px-4">
      {getContent()}
    </div>
  );
};

export default Count;