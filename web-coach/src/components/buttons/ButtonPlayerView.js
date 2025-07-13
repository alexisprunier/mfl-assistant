import React from "react";

interface ButtonPlayerViewProps {
  selectedView?: string;
  onChange?: func;
  displayPricing?: Boolean;
  displayOwner?: Boolean;
}

const ButtonPlayerView: React.FC<ButtonPlayerViewProps> = ({
  selectedView,
  onChange,
  displayPricing,
  displayOwner,
}) => {
  return (
    <div className="d-flex flex-row ms-md-2 border rounded-2">
      <button
        className={
          "btn btn-small" +
          (!selectedView || selectedView === "profile"
            ? " btn-info text-white"
            : " text-main")
        }
        onClick={() => onChange("profile")}
      >
        Profile
      </button>
      <button
        className={
          "btn btn-small" +
          (selectedView === "stats" ? " btn-info text-white" : " text-main")
        }
        onClick={() => onChange("stats")}
        selected={true}
      >
        Attr.
      </button>
      <button
        className={
          "btn btn-small" +
          (selectedView === "ovr" ? " btn-info text-white" : " text-main")
        }
        onClick={() => onChange("ovr")}
      >
        OVRs
      </button>
      {displayPricing && (
        <button
          className={
            "btn btn-small" +
            (selectedView === "pricing" ? " btn-info text-white" : " text-main")
          }
          onClick={() => onChange("pricing")}
        >
          Pricing
        </button>
      )}
      {displayOwner && (
        <button
          className={
            "btn btn-small" +
            (selectedView === "owner" ? " btn-info text-white" : " text-main")
          }
          onClick={() => onChange("owner")}
        >
          Owner
        </button>
      )}
    </div>
  );
};

export default ButtonPlayerView;
