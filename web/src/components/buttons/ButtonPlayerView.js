import React from 'react';

interface ButtonPlayerViewProps {
  selectedView ? : string;
  onChange ? : func;
}

const ButtonPlayerView: React.FC < ButtonPlayerViewProps > = ({ selectedView, onChange }) => {
  return (
    <div className="d-flex flex-row ms-md-2 border rounded-2">
	    <button
	      className={"btn btn-small" + (!selectedView || selectedView === "country" ? " btn-info text-white" : " text-info")}
	      onClick={() => onChange("country")}
	    >
	      Country
	    </button>
	    <button
	      className={"btn btn-small" + (selectedView === "stats" ? " btn-info text-white" : " text-info")}
	      onClick={() => onChange("stats")}
	      selected={true}
	    >
	      Stats
	    </button>
	    <button
	      className={"btn btn-small" + (selectedView === "ovr" ? " btn-info text-white" : " text-info")}
	      onClick={() => onChange("ovr")}
	    >
	      OVRs
	    </button>
	  </div>
  );
};

export default ButtonPlayerView;