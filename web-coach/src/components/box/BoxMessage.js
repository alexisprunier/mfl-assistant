import React from 'react';
import { Link } from 'react-router-dom';

interface BoxMessageProps {
  content: Object;
  className ? : String;
}

const BoxMessage: React.FC < BoxMessageProps > = ({ content, className }) => {
  return (
    <div className={"BoxMessage w-100 h-100 " + (className ? className : "")}>
      <div className="d-flex align-items-center justify-content-center w-100 h-100">
        <div className="d-flex flex-column">
          {content}
        </div>
      </div>
    </div>
  );
};

export default BoxMessage;