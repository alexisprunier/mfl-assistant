import React, { useEffect, useState } from "react";
import { getOpponents } from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import ItemRowMatch from "components/items/ItemRowMatch.js";
import PopupInformation from "components/popups/PopupInformation.js";
import { formations } from "utils/formation.js";

interface PageOpponentFinderProps {}

const PageOpponentFinder: React.FC<PageOpponentFinderProps> = (props) => {
  const [matches, setMatches] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [minOverall, setMinOverall] = useState(null);
  const [maxOverall, setMaxOverall] = useState(null);

  const fetchOpponents = () => {
    setMatches(null);

    getOpponents({
      handleSuccess: (d) => {
        setMatches(d.data.getOpponents);
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

  return (
    <div id="PageOpponentFinder" className="d-flex flex-column w-100 h-100">
      <nav className="d-flex flex-grow-0 TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-binoculars-fill me-2"></i> Opponent finder
        </h3>
        <span class="text-warning">
          <i class="bi bi-cone-striped me-1"></i>ALPHA
        </span>
      </nav>

      <div
        className="d-flex flex-grow-1 flex-column flex-lg-row px-2 px-md-4 py-4"
        style={{ minHeight: 0 }}
      >
        <div className="d-flex flex-lg-basis-300 flex-column">
          <BoxCard
            className="flex-grow-0"
            title={"Filters"}
            actions={
              <div className="h-100 text-align-middle">
                <PopupInformation
                  trigger={<i class="bi bi-info-circle-fill text-main"></i>}
                  title={"What is the Opponent Finder?"}
                  content={
                    <div>
                      <p>
                        The <strong>Opponent Finder</strong> is a module
                        designed to help you explore recent{" "}
                        <strong>Friendly matches</strong> in order to scan the
                        default teams used by various clubs. By applying filters
                        like <strong>formation</strong> and{" "}
                        <strong>team overall rating</strong>, it's easy to
                        identify an opponent that matches your desired criteria.
                      </p>
                      <p>
                        This tool is particularly useful for scouting potential
                        opponents for balanced or strategic matchups.
                      </p>
                      <div class="warning">
                        ⚠️ <strong>Note:</strong> While the Opponent Finder
                        helps you find clubs based on past matches, there is{" "}
                        <em>no guarantee</em> that the opponent will use the
                        same team or overall rating in a new friendly. Users can
                        change their team setups at any time after those matches
                        occurred.
                      </div>
                    </div>
                  }
                />
              </div>
            }
            content={
              <div className="d-flex flex-fill flex-column">
                <select
                  className="form-control w-100 text-white me-0 me-sm-1"
                  value={selectedFormation}
                  onChange={(v) => setSelectedFormation(v.target.value)}
                >
                  <option value={null} key={null} />
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
                <div className="d-flex justify-content-end flex-row align-items-end mb-1">
                  <button
                    className="btn btn-info text-white align-self-end"
                    onClick={fetchOpponents}
                  >
                    <i class="bi bi-arrow-right-square-fill text-white"></i> Run
                  </button>
                </div>
              </div>
            }
          />
        </div>

        <div className="height-1-lg d-flex flex-fill flex-lg-grow-1">
          <BoxCard
            className="d-flex flex-fill overflow-auto"
            title={"Friendly matches"}
            content={
              matches ? (
                <div
                  className="d-flex flex-column flex-fill"
                  style={{ minHeight: 0 }}
                >
                  {matches.map((m) => (
                    <ItemRowMatch match={m} />
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
