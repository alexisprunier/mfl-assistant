import React from "react";
import "./Item.css";
import LoadingSquare from "components/loading/LoadingSquare.js";

interface ItemCardMatchReportProps {
  title: String;
  report: object;
  loading: Boolean;
}

const ItemCardMatchReport: React.FC<ItemCardMatchReportProps> = ({
  title,
  report,
  loading,
}) => {
  return (
    <div className="card d-flex flex-column m-2 p-3 pt-2 fade-in">
      <div className="d-flex flex-row">
        <div className="d-flex">
          <h4 className="flex-grow-1">{title}</h4>
        </div>
      </div>

      <div className="d-flex flex-fill w-100">
        {loading ? (
          <div className="w-100" style={{ height: "300px" }}>
            <LoadingSquare />
          </div>
        ) : (
          <div className="row px-1">
            <div className="col-4"></div>
            <div className="col-4 text-center">My club</div>
            <div className="col-4 text-center">Opponent</div>

            <div className="col-12 text-white border-bottom mt-2 mb-1">
              General
            </div>

            <div className="col-4">Average rating</div>
            <div className="col-4 text-center">
              {report?.myClub?.rating.toFixed(2)}
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.rating.toFixed(2)}
            </div>

            <div className="col-12 text-white border-bottom mt-2 mb-1">
              Attack
            </div>

            <div className="col-4">Goals (xG)</div>
            <div className="col-4 text-center">
              {report?.myClub?.goals + report?.opponent?.ownGoals} (
              {report?.myClub?.xG.toFixed(2)})
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.goals + report?.myClub?.ownGoals} (
              {report?.opponent?.xG.toFixed(2)})
            </div>

            <div className="col-4">Shots (on target)</div>
            <div className="col-4 text-center">
              {report?.myClub?.shots} ({report?.myClub?.shotsOnTarget})
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.shots} ({report?.opponent?.shotsOnTarget})
            </div>

            <div className="col-4">Assists</div>
            <div className="col-4 text-center">{report?.myClub?.assists}</div>
            <div className="col-4 text-center">{report?.opponent?.assists}</div>

            <div className="col-4">Fouls suff.</div>
            <div className="col-4 text-center">
              {report?.myClub?.foulsSuffered}
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.foulsSuffered}
            </div>

            <div className="col-12 text-white border-bottom mt-2 mb-1">
              Creation
            </div>

            <div className="col-4">Dribbling (success)</div>
            <div className="col-4 text-center">
              {report?.myClub?.dribbledPast} ({report?.myClub?.dribblingSuccess}
              )
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.dribbledPast} (
              {report?.opponent?.dribblingSuccess})
            </div>

            <div className="col-4">Crosses (accurate)</div>
            <div className="col-4 text-center">
              {report?.myClub?.crosses} ({report?.myClub?.crossesAccurate})
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.crosses} ({report?.opponent?.crossesAccurate})
            </div>

            <div className="col-4">Passes (accurate)</div>
            <div className="col-4 text-center">
              {report?.myClub?.passes} ({report?.myClub?.passesAccurate})
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.passes} ({report?.opponent?.passesAccurate})
            </div>

            <div className="col-12 text-white border-bottom mt-2 mb-1">
              Defense
            </div>

            <div className="col-4">Own goals</div>
            <div className="col-4 text-center">{report?.myClub?.ownGoals}</div>
            <div className="col-4 text-center">
              {report?.opponent?.ownGoals}
            </div>

            <div className="col-4">GK saves</div>
            <div className="col-4 text-center">{report?.myClub?.saves}</div>
            <div className="col-4 text-center">{report?.opponent?.saves}</div>

            <div className="col-4">Cards (y/r)</div>
            <div className="col-4 text-center">
              {report?.myClub?.yellowCards}/{report?.myClub?.redCards}
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.yellowCards}/{report?.opponent?.redCards}
            </div>

            <div className="col-4">Fouls comm.</div>
            <div className="col-4 text-center">
              {report?.myClub?.foulsCommitted}
            </div>
            <div className="col-4 text-center">
              {report?.opponent?.foulsCommitted}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCardMatchReport;
