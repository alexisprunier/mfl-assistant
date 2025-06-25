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
  rate: Boolean;
}

const ItemRowMatch: React.FC<ItemRowMatchProps> = ({ match, rate }) => {
  const { homeClub, awayClub, homeScore, awayScore } = match;

  // Helper to get club logo URL, fallback to default if needed
  const getLogoUrl = (club?: Club | null) =>
    club?.logoUrl ||
    `https://d13e14gtps4iwl.cloudfront.net/u/clubs/${club?.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`;

  return (
    <div className="Item ItemRowMatch d-flex flex-column">
      <div className="d-flex flex-column flex-md-row">
        <div className="d-flex flex-row flex-md-basis-420">
          <div className="d-flex flex-row flex-basis-100">
            <i class="bi bi-caret-right-square-fill me-1"></i>
            {match.type}
          </div>

          <div className="d-flex flex-row flex-basis-140">
            <div style={{ opacity: ".2" }}>Status:</div>&nbsp;{match.status}
          </div>

          {rate && (
            <div className="d-flex flex-row flex-basis-140">
              <div style={{ opacity: ".2" }}>Perf.:</div>&nbsp;{rate}
            </div>
          )}
        </div>
        <div className="d-flex flex-grow-1 justify-content-end">
          {match.startDate
            ? match.startDate.split("+")[0].slice(0, -3).replace("T", " ")
            : ""}
        </div>
      </div>

      <div className="d-flex flex-row flex-fill align-items-center">
        <div
          className="md-0 ms-md-3"
          style={{
            width: "28px",
            textAlign: "center",
            justifyContent: "middle",
          }}
        >
          {homeScore != null && ["ENDED"].includes(match.status)
            ? homeScore
            : "?"}
        </div>

        <div className="d-flex flex-grow-1">
          <ItemRowClub
            c={match.homeClub}
            overall={
              !["ENDED", "LIVE"].includes(match.status)
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
      </div>

      <div className="d-flex flex-row flex-fill align-items-center">
        <div
          className="md-0 ms-md-3"
          style={{
            width: "28px",
            textAlign: "center",
            justifyContent: "middle",
          }}
        >
          {awayScore != null && ["ENDED"].includes(match.status)
            ? awayScore
            : "?"}
        </div>
        <div className="d-flex flex-grow-1">
          <ItemRowClub
            c={match.awayClub}
            overall={
              !["ENDED", "LIVE"].includes(match.status)
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
    </div>
  );
};

export default ItemRowMatch;
