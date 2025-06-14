import React from "react";
import { getCalculatedOverall, positions } from "utils/player.js";
import MiscOverall from "components/misc/MiscOverall.js";

interface MiscOverallFieldProps {
  player: Object;
}

const positionStyle = {
  GK: { top: "90%", left: "50%" },
  CB: { top: "75%", left: "50%" },
  LB: { top: "75%", left: "25%" },
  RB: { top: "75%", left: "75%" },
  LWB: { top: "64%", left: "15%" },
  RWB: { top: "64%", left: "85%" },
  CDM: { top: "60%", left: "50%" },
  CM: { top: "48%", left: "50%" },
  LM: { top: "48%", left: "25%" },
  RM: { top: "48%", left: "75%" },
  CAM: { top: "36%", left: "50%" },
  LW: { top: "22%", left: "20%" },
  RW: { top: "22%", left: "80%" },
  CF: { top: "25%", left: "50%" },
  ST: { top: "14%", left: "50%" },
};

const MiscOverallField: React.FC<MiscOverallFieldProps> = ({ player }) => {
  return (
    <div
      className="football-field"
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "100%", // 1:1 aspect ratio
        backgroundColor: "#e0f7fa",
        border: "2px solid #006064",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {positions.map((pos) => {
        const overall = getCalculatedOverall(player, pos.name);

        const style: React.CSSProperties = {
          position: "absolute",
          width: "60px",
          height: "30px",
          ...positionStyle[pos.name],
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(33, 37, 41, .9)",
          color: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          textAlign: "center",
        };

        return (
          <div key={pos.name} style={style}>
            <div style={{ lineHeight: "1" }}>{pos.name}</div>
            <MiscOverall
              player={player}
              actualPosition={pos.name}
              calculatedOvr={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MiscOverallField;
