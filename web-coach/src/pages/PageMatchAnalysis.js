import BoxLogin from "components/box/BoxLogin.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import React, { useEffect, useState } from "react";
import { getMatches, getClub, getMatchReport } from "services/api-mfl.js";
import ItemCardClub from "components/items/ItemCardClub.js";
import ItemCardMatch from "components/items/ItemCardMatch.js";
import ItemCardMatchReport from "components/items/ItemCardMatchReport.js";
import ControllerMflMatchType from "components/controllers/ControllerMflMatchType.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupSelectClub from "components/popups/PopupSelectClub.js";

interface PageToolsMatchAnalysisProps {}

const PageToolsMatchAnalysis: React.FC<PageToolsMatchAnalysisProps> = (props) => {
  const [club, setClub] = useState(null);
  const [matches, setMatches] = useState(null);
  const [selectedMatchIds, setSelectedMatchIds] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [selectedCriteria, setSelectedCriteria] = useState("All");

  const [matchReports, setMatchReports] = useState({});
  const [loadingMatchReport, setLoadingMatchReport] = useState(false);
  const [currentAggregatedReport, setCurrentAggregatedReport] = useState({});
  const [aggregatedReports, setAggregatedReports] = useState([]);

  const fetchMatches = () => {
    if (props.assistantUser && club) {
      setLoadingMatches(true);

      getClub({
        handleSuccess: (d) => {
          getMatches({
            handleSuccess: (m) => {
              setMatches(m);
              setLoadingMatches(false);
            },
            handleError: (e) => console.log(e),
            params: {
              squadId: d.squads[0].id,
              limit: 15,
              past: true,
              onlyCompetitions: selectedCriteria === "Competitions",
              onlyFriendliesHome: selectedCriteria === "Home friendlies",
            },
          });
        },
        handleError: (e) => console.log(e),
        id: club.id,
      });
    }
  };

  const fetchMatchReports = (ids) => {
    if (ids) {
      ids.forEach((id) => {
        if (Object.keys(matchReports).indexOf(id.toString()) < 0) {
          setLoadingMatchReport(true);
          getMatchReport({
            handleSuccess: (m) => {
              setMatchReports({
                ...matchReports,
                ...{ [id]: m },
              });
              setLoadingMatchReport(false);
            },
            handleError: (e) => console.log(e),
            id,
          });
        }
      });
    }
  };

  const computeAggregatedReport = () => {
    const aggregatedReport = {
      myClub: {},
      opponent: {},
    };

    selectedMatchIds.forEach((id) => {
      const match = matches.filter((m) => m.id === id).pop();
      const matchReport = matchReports[id];

      if (match && matchReport) {
        if (match.homeSquad.club.id === club.id) {
          matchReport.home.playersStats.forEach((s) => {
            aggregatedReport.myClub = addStats(aggregatedReport.myClub, s);
          });
          matchReport.away.playersStats.forEach((s) => {
            aggregatedReport.opponent = addStats(aggregatedReport.opponent, s);
          });
        } else {
          matchReport.home.playersStats.forEach((s) => {
            aggregatedReport.opponent = addStats(aggregatedReport.opponent, s);
          });
          matchReport.away.playersStats.forEach((s) => {
            aggregatedReport.myClub = addStats(aggregatedReport.myClub, s);
          });
        }
      }
    });

    setCurrentAggregatedReport(aggregatedReport);
  };

  const addStats = (current, added) => {
    const aggregated = {};

    Object.keys(added).forEach((key) => {
      if (typeof added[key] === "number") {
        if (["rating"].includes(key)) {
          const totalRating = (current.rating || 0) * (current.ratingCount || 0) + added[key];
          const newRatingCount = (current.ratingCount || 0) + 1;
          aggregated.rating = totalRating / newRatingCount;
          aggregated.ratingCount = newRatingCount;
        } else {
          aggregated[key] = (current[key] || 0) + added[key];
        }
      }
    });

    Object.keys(current).forEach((key) => {
      if (!(key in aggregated)) {
        aggregated[key] = current[key];
      }
    });

    return aggregated;
  };

  const saveCurrentAggregatedReport = () => {
    setAggregatedReports([...[currentAggregatedReport], ...aggregatedReports]);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (props.assistantUser) {
      setMatches(null);
      fetchMatches();
    }
  }, [props.assistantUser, club, selectedCriteria]);

  useEffect(() => {
    if (matches && club) {
      const stats = {};

      matches.forEach((match) => {
        const isHome = match.homeSquad?.club?.id === club.id;
        const isAway = match.awaySquad?.club?.id === club.id;

        if (isHome || isAway) {
          const opponentClub = isHome ? match.awaySquad?.club : match.homeSquad?.club;

          if (opponentClub) {
            const { id, name } = opponentClub;

            if (!stats[id]) {
              stats[id] = { id, name, playCount: 0 };
            }

            stats[id].playCount += 1;
          }
        }
      });
    }

    if (!club) {
      setSelectedMatchIds([]);
      setMatches(null);
      setMatchReports([]);
    }
  }, [matches, club]);

  useEffect(() => {
    fetchMatchReports(selectedMatchIds);
  }, [selectedMatchIds]);

  useEffect(() => {
    computeAggregatedReport();
  }, [selectedMatchIds, matchReports]);

  if (!props.assistantUser) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <ButtonLogin
          flowUser={props.flowUser}
          assistantUser={props.assistantUser}
          logout={props.logout}
          content={<BoxLogin assistantUser={props.assistantUser} />}
        />
      </div>
    );
  }

  return (
    <div id="PageToolsMatchAnalysis" className="h-100 w-100">
      <div className="h-100 w-100">
        <nav className="TopBar navbar w-100 px-4 py-2">
          <h3 className="my-2 ps-5">
            <i className="bi bi-clipboard2-pulse-fill me-2"></i> Match analysis
          </h3>
        </nav>

        <div className="container-xl px-md-4 py-4">
          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-column flex-md-grow-0 flex-md-basis-300 flex-md-shrink-0">
              <div className="card d-flex flex-column m-2 p-3 pt-2">
                <div className="d-flex flex-row">
                  <h4 className="flex-grow-1">Selected club</h4>

                  {club && (
                    <button className="btn btn-warning btn-small text-white mb-2" onClick={() => setClub(null)}>
                      <i className="bi bi-x-square-fill text-white"></i>
                    </button>
                  )}
                </div>

                <div className="d-flex justify-content-center">
                  {club ? (
                    <div className="d-flex flex-column flex-md-grow-1 flex-fill">
                      <ItemCardClub id={club.id} name={club.name} />
                    </div>
                  ) : (
                    <PopupSelectClub
                      userId={props.assistantUser.id}
                      trigger={
                        <button className="btn btn-info text-white">
                          <i className="bi bi-check-lg" /> Select club
                        </button>
                      }
                      onConfirm={(c) => setClub(c)}
                    />
                  )}
                </div>
              </div>

              <div className="d-flex flex-column flex-md-basis-300 w-100">
                {(loadingMatches || matches) && (
                  <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 m-2 p-3 pt-2 fade-in">
                    <div className="d-flex flex-row">
                      <h4 className="flex-grow-1">Matches</h4>
                    </div>

                    <div className="d-flex flex-row justify-content-end mb-1">
                      <ControllerMflMatchType
                        selectedCriteria={selectedCriteria}
                        onChange={(c) => setSelectedCriteria(c)}
                      />
                    </div>

                    <div className="d-flex flex-fill flex-column">
                      {matches ? (
                        matches.map((m) => (
                          <div className="my-1">
                            <ItemCardMatch
                              match={m}
                              onClick={(id) => {
                                if (selectedMatchIds.indexOf(id) >= 0) {
                                  setSelectedMatchIds(selectedMatchIds.filter((i) => i !== id));
                                } else {
                                  setSelectedMatchIds([...selectedMatchIds, ...[id]]);
                                }
                              }}
                              disabled={loadingMatchReport}
                              selected={selectedMatchIds.indexOf(m.id) >= 0}
                            />
                          </div>
                        ))
                      ) : (
                        <LoadingSquare height={200} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex flex-column flex-md-grow-1">
              {currentAggregatedReport?.myClub && Object.keys(currentAggregatedReport.myClub).length > 0 && (
                <div className="d-flex flex-column">
                  <ItemCardMatchReport
                    report={currentAggregatedReport}
                    title={"Current report"}
                    loading={loadingMatchReport}
                  />

                  <div className="d-flex justify-content-end">
                    <button
                      className="d-block btn btn-info btn-sm text-white mb-1 me-2"
                      onClick={() => saveCurrentAggregatedReport()}
                    >
                      <i className="bi bi-box-arrow-down"></i> Save report
                    </button>
                  </div>
                </div>
              )}

              {aggregatedReports.map((r, i) => (
                <ItemCardMatchReport report={r} title={"Saved report " + (aggregatedReports.length - i)} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsMatchAnalysis;
