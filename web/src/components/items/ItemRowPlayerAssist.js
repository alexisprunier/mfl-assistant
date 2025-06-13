import React from "react";
import "./Item.css";
import MiscOverall from "components/misc/MiscOverall.js";
import LoadingSquare from "components/loading/LoadingSquare";
import {
  positions,
  getCalculatedOverall,
  getOverallTag,
} from "utils/player.js";
import PopupInformationPricing from "components/popups/PopupInformationPricing";
import PopupPlayer from "components/popups/PopupPlayer";

interface ItemRowPlayerAssistProps {
  p: object;
  display: string;
  isSelected: boolean;
  selectable: boolean;
  onSelect: func;
  pricing?: Number;
}

const ItemRowPlayerAssist: React.FC<ItemRowPlayerAssistProps> = ({
  p,
  display,
  isSelected,
  selectable,
  onSelect,
  pricing,
}) => {
  const getOVRs = () => {
    return positions
      .map((pos) => {
        const calcOVR = getCalculatedOverall(p, pos.name);
        return {
          pos: pos.name,
          ovr: calcOVR,
          diff: calcOVR - p.overall,
        };
      })
      .filter((a) => a.ovr > 0)
      .sort((a, b) => b.ovr - a.ovr)
      .slice(0, 3);
  };

  const getDiff = (diff) => {
    if (diff === 0) {
      return;
    }

    if (diff > 0) {
      return <div className="d-inline-block text-info">+{diff}</div>;
    } else {
      return <div className="d-inline-block text-danger">{diff}</div>;
    }
  };

  return (
    <div
      className={
        "Item d-flex flex-row flex-fill " + (isSelected ? "selected" : "")
      }
    >
      {selectable && (
        <div className="d-flex me-1">
          <input
            type="checkbox"
            defaultChecked={isSelected}
            onChange={() => (onSelect ? onSelect(p) : undefined)}
          />
        </div>
      )}
      <PopupPlayer
        className="flex-fill"
        player={p}
        trigger={
          <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
            <div className="d-flex flex-row flex-md-basis-340">
              <i className="bi bi-person-badge-fill me-1" />

              <div className="d-flex flex-fill min-width-0">
                <div className="text-truncate w-100">
                  {p.firstName} {p.lastName}
                </div>
              </div>

              <div className="d-flex flex-basis-40">
                <MiscOverall player={p} />
              </div>

              <div className="d-flex flex-basis-120">
                {p.positions.join(", ")}
              </div>
            </div>

            <div className="d-flex flex-md-grow-1">
              {(!display || display === "profile") && (
                <div className="d-flex flex-grow-1">
                  <div className={"d-inline-block"} style={{ width: "50px" }}>
                    <i class="bi bi-cake2-fill me-1"></i>
                    {p.age}
                  </div>

                  <div className={"d-inline-block"} style={{ width: "50px" }}>
                    <i class="bi bi-rulers me-1"></i>
                    {p.height}
                  </div>

                  {p.nationalities && p.nationalities[0] ? (
                    <img
                      className="d-inline me-1 my-1 ms-md-1"
                      style={{ height: 13 }}
                      src={`https://app.playmfl.com/img/flags/${p.nationalities[0]}.svg`}
                    />
                  ) : (
                    ""
                  )}

                  {p.nationalities && p.nationalities ? p.nationalities[0] : ""}
                </div>
              )}

              {display === "stats" && (
                <div className="d-flex flex-grow-1">
                  <div className={"me-1"}>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      P: {getOverallTag(p.pace)}
                    </div>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      D: {getOverallTag(p.dribbling)}
                    </div>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      P: {getOverallTag(p.passing)}
                    </div>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      S: {getOverallTag(p.shooting)}
                    </div>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      D: {getOverallTag(p.defense)}
                    </div>
                    <div className={"d-inline-block"} style={{ width: "35px" }}>
                      P: {getOverallTag(p.physical)}
                    </div>
                  </div>
                </div>
              )}

              {display === "ovr" && (
                <div className="d-flex flex-grow-1">
                  {getOVRs().map((o) => (
                    <div className={"me-1"}>
                      <div
                        className={"d-inline-block"}
                        style={{ width: "35px" }}
                      >
                        {o.pos}:
                      </div>
                      <div
                        className={"d-inline-block"}
                        style={{ width: "40px" }}
                      >
                        {getOverallTag(o.ovr)}
                        <small>{getDiff(o.diff)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {display === "owner" && (
                <div className="d-flex flex-grow-1">
                  <div className={"me-1"}>
                    <div className={"d-inline-block"}>
                      <i class="bi bi-person-fill me-1"></i>
                      {p.owner?.name || "???"}
                    </div>
                  </div>
                </div>
              )}

              {display === "pricing" && (
                <div className="d-flex flex-grow-1 pe-1">
                  {pricing ? (
                    <div className="d-flex flex-row">
                      Estimated pricing:&nbsp;
                      <PopupInformationPricing />
                      &nbsp;
                      <span className="text-main">${pricing}</span>
                    </div>
                  ) : (
                    <LoadingSquare />
                  )}
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ItemRowPlayerAssist;
