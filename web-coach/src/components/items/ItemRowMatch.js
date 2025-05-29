import React from "react";
import "./Item.css";
import ItemRowClub from "components/items/ItemRowClub.js";
import { calculateTeamOverall } from "utils/overall.js";

interface Club {
  id?: string;
  name?: string;
  logoUrl?: string; // assuming you have a logo URL or construct it
}

interface Match {
  homeClub: Club | null;
  awayClub: Club | null;
  homeScore: number | null;
  awayScore: number | null;
}

interface ItemRowMatchProps {
  match: Match;
}

const ItemRowMatch: React.FC<ItemRowMatchProps> = ({ match }) => {
  const { homeClub, awayClub, homeScore, awayScore } = match;

  // Helper to get club logo URL, fallback to default if needed
  const getLogoUrl = (club?: Club | null) =>
    club?.logoUrl ||
    `https://d13e14gtps4iwl.cloudfront.net/u/clubs/${club?.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`;

  return (
    <div className="Item d-flex flex-column">
      <div className="ItemRowMatch d-flex align-items-center justify-content-between">
        {/* Home club left */}
        <div className="d-flex align-items-center flex-fill me-3">
          {homeClub && (
            <>
              <img
                className="club-logo me-2"
                src={getLogoUrl(homeClub)}
                alt={homeClub.name || "Home Club"}
                style={{ width: 16, height: 16, objectFit: "contain" }}
              />
              <span>{homeClub.name || "Unknown Home Club"}</span>
            </>
          )}
        </div>

        {/* Score center */}
        <div
          className="d-flex align-items-center justify-content-center flex-grow-0"
          style={{ minWidth: 60 }}
        >
          <span className="fw-bold">
            {homeScore != null ? homeScore : "-"} :{" "}
            {awayScore != null ? awayScore : "-"}
          </span>
        </div>

        {/* Away club right */}
        <div className="d-flex align-items-center flex-fill justify-content-end ms-3">
          {awayClub && (
            <>
              <span>{awayClub.name || "Unknown Away Club"}</span>
              <img
                className="club-logo ms-2"
                src={getLogoUrl(awayClub)}
                alt={awayClub.name || "Away Club"}
                style={{ width: 16, height: 16, objectFit: "contain" }}
              />
            </>
          )}
        </div>
      </div>
      <div className="d-flex flex-fill justify-content-end">
        {match.startDate ? match.startDate.split("+")[0] : ""}
      </div>
      <div>
        <ItemRowClub
          c={match.homeClub}
          overall={calculateTeamOverall(
            match.homePositions,
            match.players,
            match.modifiers
          )}
          formation={match.homeFormation}
        />
      </div>
      <div>
        <ItemRowClub
          c={match.awayClub}
          overall={calculateTeamOverall(
            match.awayPositions,
            match.players,
            match.modifiers
          )}
          formation={match.awayFormation}
        />
      </div>
    </div>
  );
};

export default ItemRowMatch;
