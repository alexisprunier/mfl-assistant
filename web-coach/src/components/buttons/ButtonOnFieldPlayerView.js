import React from "react";

interface ButtonOnFieldPlayerViewProps {
  selectedView?: string;
  selectedAttribute?: string;
  onChange?: func;
  onAttributeChange?: func;
}

const ButtonOnFieldPlayerView: React.FC<ButtonOnFieldPlayerViewProps> = ({
  selectedView,
  selectedAttribute,
  onChange,
  onAttributeChange,
}) => {
  return (
    <div className="d-flex flex-column align-items-end">
      <div className="d-flex flex-row ms-md-2 border rounded-2" style={{ width: "fit-content" }}>
        <button
          className={"btn btn-small" + (selectedView === "profile" ? " btn-info text-white" : " text-main")}
          onClick={() => onChange("profile")}
          selected={true}
        >
          Profile
        </button>
        <button
          className={"btn btn-small" + (selectedView === "attr" ? " btn-info text-white" : " text-main")}
          onClick={() => onChange("attr")}
        >
          Attr.
        </button>
        <button
          className={
            "btn btn-small" + (!selectedView || selectedView === "ovr" ? " btn-info text-white" : " text-main")
          }
          onClick={() => onChange("ovr")}
        >
          OVRs
        </button>
        {/*<button
          className={"btn btn-small" + (selectedView === "depth" ? " btn-info text-white" : " text-main")}
          onClick={() => onChange("depth")}
        >
          Depth
        </button>*/}
      </div>

      {selectedView === "attr" && (
        <div className="d-flex flex-row ms-md-2 border rounded-2" style={{ width: "fit-content" }}>
          <button
            className={
              "btn btn-small" +
              (!selectedAttribute || selectedAttribute === "pac" ? " btn-info text-white" : " text-main")
            }
            onClick={() => onAttributeChange("pac")}
            selected={true}
          >
            Pac-Sho
          </button>
          <button
            className={"btn btn-small" + (selectedAttribute === "dri" ? " btn-info text-white" : " text-main")}
            onClick={() => onAttributeChange("dri")}
          >
            Dri-Pas
          </button>
          <button
            className={"btn btn-small" + (selectedAttribute === "def" ? " btn-info text-white" : " text-main")}
            onClick={() => onAttributeChange("def")}
          >
            Def-Phy
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonOnFieldPlayerView;
