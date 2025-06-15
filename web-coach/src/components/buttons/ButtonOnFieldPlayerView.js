import React from "react";

interface ButtonOnFieldPlayerViewProps {
  selectedView?: string;
  onChange?: func;
}

const ButtonOnFieldPlayerView: React.FC<ButtonOnFieldPlayerViewProps> = ({
  selectedView,
  onChange,
}) => {
  return (
    <div className="d-flex flex-row ms-md-2 border rounded-2">
      <button
        className={
          "btn btn-small" +
          (!selectedView || selectedView === "ovr"
            ? " btn-info text-white"
            : " text-main")
        }
        onClick={() => onChange("ovr")}
      >
        OVR
      </button>
      <button
        className={
          "btn btn-small" +
          (selectedView === "profile" ? " btn-info text-white" : " text-main")
        }
        onClick={() => onChange("profile")}
        selected={true}
      >
        Profile
      </button>
    </div>
  );
};

export default ButtonOnFieldPlayerView;
