import React from "react";

interface ButtonOnFieldPlayerViewProps {
  selectedView?: string;
  onChange?: func;
}

const ButtonOnFieldPlayerView: React.FC<ButtonOnFieldPlayerViewProps> = ({ selectedView, onChange }) => {
  return (
    <div className="d-flex flex-row ms-md-2 border">
      <button
        className={"btn btn-small" + (!selectedView || selectedView === "ovr" ? " btn-info text-white" : " text-info")}
        onClick={() => onChange("ovr")}
      >
        OVR
      </button>
      <button
        className={"btn btn-small" + (selectedView === "age" ? " btn-info text-white" : " text-info")}
        onClick={() => onChange("age")}
        selected={true}
      >
        Age
      </button>
    </div>
  );
};

export default ButtonOnFieldPlayerView;
