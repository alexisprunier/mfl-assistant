import React from 'react';
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import MiscOverall from "components/misc/MiscOverall.js";
import { positions, getCalculatedOverall } from "utils/player.js";

interface ItemRowPlayerAssistProps {
  p: object;
  display: string;
  isSelected: bool;
  onSelect: func;
}

const ItemRowPlayerAssist: React.FC < ItemRowPlayerAssistProps > = ({ p, display, isSelected, onSelect }) => {

  const getOVRs = () => {
    return positions
      .map((pos) => {
        const calcOVR = getCalculatedOverall(p, pos.name);
        return {
          pos: pos.name,
          ovr: calcOVR,
          diff: calcOVR - p.overall,
        }
      })
      .filter((a) => a.ovr > 0)
      .sort((a, b) => b.ovr - a.ovr)
      .slice(0, 3);
  }

  const getDiff = (diff) => {
    if (diff === 0) {
      return;
    }

    if (diff > 0) {
      return <div className="d-inline-block text-info">+{diff}</div>
    } else {
      return <div className="d-inline-block text-danger">{diff}</div>
    }
  }

  return (
    <div
      className={"Item flex-fill " + (isSelected ? "selected" : "")}
      onClick={onSelect ? () => onSelect(p) : undefined}
    >
      <div className="d-flex flex-column flex-md-row flex-fill pb-1 pb-md-0">
        <div className="d-flex flex-row flex-basis-300">
          <i className="bi bi-person-badge-fill me-1"/>

          <div className="d-flex flex-fill">
            <span className="d-inline-block text-truncate">
              {p.firstName} {p.lastName}
            </span>
          </div>

          <div className="d-flex flex-basis-40">
            <MiscOverall
              player={p}
            />
          </div>

          <div className="d-flex flex-basis-80">
            {p.positions.join(", ")}
          </div>
        </div>

        <div className="d-flex flex-md-grow-1">
          {!display
            && <div className="d-flex flex-grow-1">
              {p.nationalities && p.nationalities[0]
                ? <img
                  className="d-inline me-1 my-1 ms-md-1"
                  style={{height: 14}}
                  src={`https://app.playmfl.com/img/flags/${p.nationalities[0]}.svg`}
                />
                : ""
              }

              {p.nationalities && p.nationalities ? p.nationalities[0] : ""}
            </div>
          }

          {display === "ovr"
            && <div className="d-flex flex-grow-1">
              {getOVRs().map((o) => 
                <div className={"me-1"}>
                  <div className={"d-inline-block"} style={{ width: "35px" }}>{o.pos}:</div>
                  <div className={"d-inline-block"} style={{ width: "40px" }}>{o.ovr}<small>{getDiff(o.diff)}</small></div>
                </div>
              )}
            </div>
          }

          <div className="d-flex flex-row flex-grow-0 justify-content-end">
            <div className="me-1">
              <ButtonMflPlayerInfo
                playerId={p.id}
              />
            </div>
            <div>
              <ButtonMflPlayer
                playerId={p.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRowPlayerAssist;