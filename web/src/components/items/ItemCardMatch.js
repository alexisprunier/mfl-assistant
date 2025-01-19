import React from "react";
import { unixTimestampToDateTimeString } from "utils/date";

interface MatchData {
  id: number;
  status: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  homeSquad: {
    id: number,
    club: {
      id: number,
      name: string,
      mainColor: string,
      secondaryColor: string,
      logoVersion: string,
    },
  };
  awaySquad: {
    id: number,
    club: {
      id: number,
      name: string,
      mainColor: string,
      secondaryColor: string,
      logoVersion: string,
    },
  };
  startDate: number;
}

interface ItemCardMatchProps {
  match: MatchData;
  onClick?: func;
  selected: Boolean;
  disabled: Boolean;
}

const ItemCardMatch: React.FC<ItemCardMatchProps> = ({
  match,
  onClick,
  selected,
  disabled,
}) => {
  return (
    <div
      className={
        "ItemCardMatch card bg-black py-1 px-2 " +
        (selected ? "selected " : "") +
        (onClick ? "selectable " : "") +
        (disabled ? "disabled" : "")
      }
      onClick={() => !disabled && onClick && onClick(match.id)}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="team d-flex flex-column flex-grow-1 align-items-center"
          style={{ color: match.homeSquad.club.mainColor }}
        >
          <img
            src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${match.homeSquad.club.id}/logo.png?v=${match.homeSquad.club.logoVersion}`}
            alt={`${match.homeTeamName} logo`}
            style={{ height: "50px" }}
          />
        </div>

        <div className="match-info text-center">
          <div className="score text-white">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="status text-small">{match.status}</div>
        </div>

        <div
          className="team d-flex flex-column flex-grow-1 align-items-center"
          style={{ color: match.awaySquad.club.mainColor }}
        >
          <img
            src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${match.awaySquad.club.id}/logo.png?v=${match.awaySquad.club.logoVersion}`}
            alt={`${match.awayTeamName} logo`}
            style={{ height: "50px" }}
          />
        </div>
      </div>

      <div className="text-center text-small time">
        {unixTimestampToDateTimeString(match.startDate)}
      </div>
    </div>
  );
};

export default ItemCardMatch;
