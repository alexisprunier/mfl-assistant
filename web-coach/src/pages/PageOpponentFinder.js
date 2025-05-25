import React, { useEffect, useState } from "react";
import { getOpponents } from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import ItemRowMatch from "components/items/ItemRowMatch.js";
import { formations } from "utils/formation.js";

interface PageOpponentFinderProps {}

const PageOpponentFinder: React.FC<PageOpponentFinderProps> = (props) => {
  const [matchClubPairs, setMatchClubPairs] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [minOverall, setMinOverall] = useState(null);
  const [maxOverall, setMaxOverall] = useState(null);

  const fetchOpponents = () => {
    getOpponents({
      handleSuccess: (d) => {
        setMatchClubPairs(d.data.getOpponents);
      },
      handleError: (e) => console.log(e),
      params: {
        formation: selectedFormation,
        minOvr: minOverall,
        maxOvr: maxOverall,
      },
    });
  };

  useEffect(() => {
    fetchOpponents();
  }, []);

  useEffect(() => {
    fetchOpponents();
  }, [selectedFormation, minOverall, maxOverall]);

  return (
    <div id="PageOpponentFinder" className="d-flex flex-column w-100 h-100">
      <nav className="d-flex flex-grow-0 TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-binoculars-fill me-2"></i> Opponent finder
        </h3>
      </nav>

      <div className="d-flex flex-grow-1 flex-column container-xl px-2 px-md-4 py-4">
        <div className="d-flex" style={{ minHeight: "90px" }}>
          <BoxCard
            className="flex-fill pt-3"
            content={
              <div className="d-flex flex-fill flex-column flex-lg-row">
                <div className="d-flex flex-grow-0 flex-column flex-sm-row">
                  <select
                    className="form-control w-100 text-white me-0 me-sm-1"
                    value={selectedFormation}
                    onChange={(v) => setSelectedFormation(v.target.value)}
                  >
                    <option value={""} key={null} />
                    {Object.keys(formations).map((p) => (
                      <option value={p.toString()} key={p.toString()}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="300"
                    max="1200"
                    step="1"
                    className="form-control w-100 mb-1"
                    value={minOverall}
                    onChange={(v) => setMinOverall(parseInt(v.target.value))}
                    placeholder={"Min OVR"}
                  />
                  <input
                    type="number"
                    min="300"
                    max="1200"
                    step="1"
                    className="form-control w-100 mb-1"
                    value={maxOverall}
                    onChange={(v) => setMaxOverall(parseInt(v.target.value))}
                    placeholder={"Max OVR"}
                  />
                </div>
              </div>
            }
          />
        </div>

        <div
          className="d-flex flex-fill overflow-auto"
          style={{ height: "1px" }}
        >
          <BoxCard
            className="d-flex flex-fill overflow-auto"
            content={
              matchClubPairs ? (
                <div
                  className="d-flex flex-column flex-fill"
                  style={{ minHeight: 0 }}
                >
                  {matchClubPairs.map((m) => (
                    <ItemRowMatch match={m.match} />
                  ))}
                </div>
              ) : (
                <div className="w-100 h-100">
                  <LoadingSquare />
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PageOpponentFinder;
