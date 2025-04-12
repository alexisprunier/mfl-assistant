import React from 'react';

interface LoadingBarProps {
	value?: number;
	total?: number;
	display?: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ value, total, display }) => {

	const getProgressValue = () => {
		if (!value && !total) {
			return 5;
		}

		if (value && !total) {
			return value / ( value + 20 ) * 100;
		}

		return value / total * 100;
	}

	const getProgressText = () => {
		if (!value && !total) {
			return "? / ?";
		}

		if (value && !total) {
			return value + " / ?";
		}

		return value + " / " + total;
	}

  return (
    <div className={"progress position-absolute top-0 start-0 rounded-0 w-100 p-0" + (!display ? " fade" : "")}>
	    <div
	      className="progress-bar progress-bar-striped bg-info progress-bar-animated text-align-middle"
	      role="progressbar"
	      style={{ width: getProgressValue() + "%" }}
	      aria-valuenow={getProgressValue() + ""}
	      aria-valuemin="0"
	      aria-valuemax="100"
	      >
	      <small className="justify-content-center d-flex position-absolute w-100">
	      	{getProgressText()}
	      </small>
	    </div>
	  </div>
  );
};

export default LoadingBar;