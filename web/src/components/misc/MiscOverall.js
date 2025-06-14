import React from "react";
import { getCalculatedOverall, getOverallColor } from "utils/player.js";

interface MiscOverallProps {
  player: Object;
  actualPosition?: string;
  calculatedOvr?: boolean;
}

const MiscOverall: React.FC<MiscOverallProps> = ({
  player,
  actualPosition,
  calculatedOvr,
}) => {
  const getDifferenceString = () => {
    if (getCalculatedOverall(player, actualPosition) - player.overall >= 0) {
      return `(+${
        getCalculatedOverall(player, actualPosition) - player.overall
      })`;
    } else {
      return `(-${Math.abs(
        getCalculatedOverall(player, actualPosition) - player.overall
      )})`;
    }
  };

  return (
    <div>
      {calculatedOvr ? (
        <div className="d-flex flex-row">
          <div
            style={{
              color: getOverallColor(
                getCalculatedOverall(player, actualPosition)
              ),
              lineHeight: 1,
            }}
          >
            {getCalculatedOverall(player, actualPosition)}
          </div>
          <div
            className={
              "small mt-auto " +
              (getDifferenceString().indexOf("+") >= 0
                ? "text-info"
                : "text-danger")
            }
            style={{ lineHeight: 1 }}
          >
            {getDifferenceString()}
          </div>
        </div>
      ) : (
        <div style={{ color: getOverallColor(player.overall) }}>
          {player.overall}
        </div>
      )}
    </div>
  );
};

export default MiscOverall;
