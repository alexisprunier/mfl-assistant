import React from "react";

interface ButtonPlayerViewProps {
  selectedView?: string;
  onChange?: func;
  displayPricing?: Boolean;
}

const ButtonPlayerView: React.FC<ButtonPlayerViewProps> = ({
  selectedView,
  onChange,
  displayPricing,
}) => {
  return (
    <div className="d-flex flex-row ms-md-2 border rounded-2">
      <button
        className={
          "btn btn-small" +
          (!selectedView || selectedView === "profile"
            ? " btn-info text-white"
            : " text-info")
        }
        onClick={() => onChange("profile")}
      >
        Profile
      </button>
      <button
        className={
          "btn btn-small" +
          (selectedView === "stats" ? " btn-info text-white" : " text-info")
        }
        onClick={() => onChange("stats")}
        selected={true}
      >
        Stats
      </button>
      <button
        className={
          "btn btn-small" +
          (selectedView === "ovr" ? " btn-info text-white" : " text-info")
        }
        onClick={() => onChange("ovr")}
      >
        OVRs
      </button>
      {displayPricing && (
        <button
          className={
            "btn btn-small" +
            (selectedView === "pricing" ? " btn-info text-white" : " text-info")
          }
          onClick={() => onChange("pricing")}
        >
          Pricing
        </button>
      )}
    </div>
  );
};

export default ButtonPlayerView;
