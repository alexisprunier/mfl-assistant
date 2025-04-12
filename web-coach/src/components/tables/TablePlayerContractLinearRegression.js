import React from 'react';
import "./TablePlayerContractLinearRegression.css";
import LoadingSquare from "components/loading/LoadingSquare";
import { divisions } from "utils/division.js";
import { computeLinearRegression } from "utils/chart.js";

interface Player {
  id: number;
}

interface TablePlayerContractLinearRegressionProps {
  players: Player[];
}

const TablePlayerContractLinearRegression: React.FC<TablePlayerContractLinearRegressionProps> = ({ players }) => {

  const getOverallRange = (pl) => {
    const minOverall = Math.min(...pl.map((p) => (p.metadata?.overall)));
    const maxOverall = Math.max(...pl.map((p) => (p.metadata?.overall)));

    return [ minOverall, maxOverall ];
  }

  const computeRow = (division) => {    
    let divisionPlayers = players.filter((p) => division.number === p.activeContract?.club?.division);

    const points = divisionPlayers.map((p) => (
      {
        x: p.metadata?.overall,
        y: p.activeContract?.revenueShare / 100,
      }
    ));

    let line = computeLinearRegression(points);

    const [ minOverall, maxOverall ] = getOverallRange(players);
    const [ minDivisionOverall, maxDivisionOverall ] = getOverallRange(divisionPlayers);

    return [...Array(maxOverall - minOverall + 1).keys()].map((i) => {
      if (!minDivisionOverall
        || !maxDivisionOverall
        || minDivisionOverall > (minOverall + i)
        || maxDivisionOverall < (minOverall + i)
        || divisionPlayers.length < 2) {
        return ".";
      }

      return Math.round((line.m * (minOverall + i) + line.b) * 100) / 100;
    });
  }

  const renderTableHeader = () => {
    const [ minOverall, maxOverall ] = getOverallRange(players);

    return (
      <thead>
        <tr>
          <th key={"division"}>DIV</th>
          <th key={"number"}>#</th>

          {[...Array(maxOverall - minOverall + 1).keys()].map((i) => (
            <th
              key={i + minOverall}
            >
              {i + minOverall}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {divisions.map((d, index) => (
          <tr key={index}>
            <td key={"division"}>
              <div
                className="ratio ratio-1x1 rounded-circle h-auto w-auto"
                style={{backgroundColor: d.color}}
              />
            </td>
            <td
              key={"number"}
              className="text-secondary"
            >
              {players.filter((p) => d.number === p.activeContract?.club?.division).length}
            </td>
            {computeRow(d).map((cell, index) => (
              <td
                key={index}
                className="align-middle text-secondary"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div id="TablePlayerContractLinearRegression" className="py-4 px-1 px-md-3">
      <div className="w-100 text-center">
        {!players
          ? <div className="ratio ratio-16x9">
            <LoadingSquare />
          </div>
          : <table className="table">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        }
      </div>
    </div>
  );
};

export default TablePlayerContractLinearRegression;