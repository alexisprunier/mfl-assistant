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
    <div className="Item ItemRowMatch d-flex flex-column">
      <div className="d-flex flex-column flex-md-row">
        <div className="d-flex flex-row flex-md-basis-420">
          <div className="d-flex flex-row flex-basis-140">
            <i class="bi bi-caret-right-square-fill me-1"></i>
            {match.type}
          </div>

          <div className="d-flex flex-row flex-basis-140">
            STATUS: {match.status}
          </div>

          <div className="d-flex flex-row flex-basis-140">
            {/* Home club left */}
            <div className="d-flex align-items-center">
              <img
                className="club-logo me-2"
                src={getLogoUrl(homeClub)}
                alt={homeClub.name || "Home Club"}
                style={{ width: 16, height: 16, objectFit: "contain" }}
              />
            </div>

            {/* Score center */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minWidth: 50 }}
            >
              <span className="fw-bold">
                {homeScore != null && match.status === "ENDED"
                  ? homeScore
                  : "?"}{" "}
                :{" "}
                {awayScore != null && match.status === "ENDED"
                  ? awayScore
                  : "?"}
              </span>
            </div>

            {/* Away club right */}
            <div className="d-flex align-items-center">
              <img
                className="club-logo ms-2"
                src={getLogoUrl(awayClub)}
                alt={awayClub.name || "Away Club"}
                style={{ width: 16, height: 16, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
        <div className="d-flex flex-grow-1 justify-content-end">
          {match.startDate ? match.startDate.split("+")[0] : ""}
        </div>
      </div>

      <div>
        <ItemRowClub
          c={match.homeClub}
          overall={
            match.status !== "ENDED"
              ? ""
              : match.homeOverall
              ? match.homeOverall
              : calculateTeamOverall(
                  match.homePositions,
                  match.players,
                  match.modifiers
                )
          }
          formation={match.homeFormation}
        />
      </div>
      <div>
        <ItemRowClub
          c={match.awayClub}
          overall={
            match.status !== "ENDED"
              ? ""
              : match.awayOverall
              ? match.awayOverall
              : calculateTeamOverall(
                  match.awayPositions,
                  match.players,
                  match.modifiers
                )
          }
          formation={match.awayFormation}
        />
      </div>
    </div>
  );
};

export default ItemRowMatch;
