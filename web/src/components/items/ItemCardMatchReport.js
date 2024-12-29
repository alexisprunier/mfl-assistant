import React from "react";
import "./Item.css";

interface ItemCardMatchReportProps {
  title: String;
  report: object;
}

const ItemCardMatchReport: React.FC<ItemCardMatchReportProps> = ({
  title,
  report,
}) => {
  return (
    <div className="card d-flex flex-column m-2 p-3 pt-2 fade-in">
      <div className="d-flex flex-row">
        <div className="d-flex">
          <h4 className="flex-grow-1">{title}</h4>
        </div>
      </div>

      <div className="d-flex flex-fill">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4">My club</div>
          <div className="col-4">Opponent</div>

          <div className="col-4">General</div>
          <div className="col-8"></div>

          <div className="col-4">Average rating</div>
          <div className="col-4">{report?.myClub?.rating.toFixed(2)}</div>
          <div className="col-4">{report?.opponent?.rating.toFixed(2)}</div>

          <div className="col-4">Attack</div>
          <div className="col-8"></div>

          <div className="col-4">Goals (xG)</div>
          <div className="col-4">
            {report?.myClub?.goals} ({report?.myClub?.xG.toFixed(2)})
          </div>
          <div className="col-4">
            {report?.opponent?.goals} ({report?.opponent?.xG.toFixed(2)})
          </div>

          <div className="col-4">Assists</div>
          <div className="col-4">{report?.myClub?.assists}</div>
          <div className="col-4">{report?.opponent?.assists}</div>

          <div className="col-4">Shots (on target)</div>
          <div className="col-4">
            {report?.myClub?.shots} ({report?.myClub?.shotsOnTarget})
          </div>
          <div className="col-4">
            {report?.myClub?.shots} ({report?.myClub?.shotsOnTarget})
          </div>

          <div className="col-4">Creation</div>
          <div className="col-8"></div>

          <div className="col-4">Dribbling (accurate)</div>
          <div className="col-4">{report?.myClub?.dribblingSuccess}</div>
          <div className="col-4">{report?.opponent?.dribblingSuccess}</div>

          <div className="col-4">Passes (accurate)</div>
          <div className="col-4">
            {report?.myClub?.passes} ({report?.myClub?.passesAccurate})
          </div>
          <div className="col-4">
            {report?.opponent?.passes} ({report?.opponent?.passesAccurate})
          </div>

          <div className="col-12 text-white">Defense</div>

          <div className="col-4">Cards (yellow/red)</div>
          <div className="col-4">
            {report?.myClub?.yellowCards}/{report?.myClub?.redCards}
          </div>
          <div className="col-4">
            {report?.opponent?.yellowCards}/{report?.opponent?.redCards}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardMatchReport;
