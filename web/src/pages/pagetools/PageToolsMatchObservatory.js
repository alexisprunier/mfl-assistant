import BoxLogin from "components/box/BoxLogin.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import React, { useEffect, useState } from "react";
import { getMatches, getClub } from "services/api-mfl.js";
import ItemCardClub from "components/items/ItemCardClub.js";
import ItemCardMatch from "components/items/ItemCardMatch.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupSelectClub from "components/popups/PopupSelectClub.js";

interface PageToolsMatchObservatoryProps {}

const PageToolsMatchObservatory: React.FC<PageToolsMatchObservatoryProps> = (
  props
) => {
  const [club, setClub] = useState(null);
  const [matches, setMatches] = useState(null);

  const [isOpponentLoading, setIsOpponentLoading] = useState(false);
  const [opponentClubs, setOpponentClubs] = useState(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState(null);

  const [opponentMatches, setOpponentMatches] = useState(null);
  const [selectedOpponentMatchIds, setSelectedOpponentMatchIds] = useState([]);

  const [matchStats, setMatchStats] = useState({});

  const fetchMatches = () => {
    if (props.assistantUser && club) {
      setIsOpponentLoading(true);

      getClub({
        handleSuccess: (d) => {
          getMatches({
            handleSuccess: (m) => {
              setMatches(m);
              setIsOpponentLoading(false);
            },
            handleError: (e) => console.log(e),
            params: {
              squadId: d.squads[0].id,
              limit: 15,
              past: true,
            },
          });
        },
        handleError: (e) => console.log(e),
        id: club.id,
      });
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (club === null) {
      setOpponentClubs(null);
      setOpponentMatches(null);
      setSelectedOpponentId(null);
      setSelectedOpponentMatchIds([]);
    }
  }, [props.assistantUser, club]);

  useEffect(() => {
    if (props.assistantUser) {
      fetchMatches();
    }
  }, [props.assistantUser, club]);

  useEffect(() => {
    if (matches && club) {
      const stats = {};

      matches.forEach((match) => {
        const isHome = match.homeSquad?.club?.id === club.id;
        const isAway = match.awaySquad?.club?.id === club.id;

        if (isHome || isAway) {
          const opponentClub = isHome
            ? match.awaySquad?.club
            : match.homeSquad?.club;

          if (opponentClub) {
            const { id, name } = opponentClub;

            if (!stats[id]) {
              stats[id] = { id, name, playCount: 0 };
            }

            stats[id].playCount += 1;
          }
        }
      });

      setOpponentClubs(
        Object.values(stats).sort((a, b) => b.playCount - a.playCount)
      );
    }
  }, [matches, club]);

  useEffect(() => {
    selectedOpponentMatchIds.forEach((id) => {});
  }, [selectedOpponentMatchIds]);

  useEffect(() => {
    if (selectedOpponentId && matches) {
      setOpponentMatches(
        matches.filter(
          (match) =>
            match.homeSquad?.club?.id === selectedOpponentId ||
            match.awaySquad?.club?.id === selectedOpponentId
        )
      );
    }
  }, [selectedOpponentId, matches]);

  if (!props.assistantUser) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <ButtonLogin
          flowUser={props.flowUser}
          assistantUser={props.assistantUser}
          logout={props.logout}
          content={<BoxLogin />}
        />
      </div>
    );
  }

  return (
    <div id="PageToolsMatchObservatory" className="h-100 w-100">
      <div className="container-xl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row">
          <div className="d-flex flex-column flex-md-grow-0 flex-basis-300">
            <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2 fade-in">
              <div className="d-flex flex-row">
                <h4 className="flex-grow-1">My club</h4>

                {club && (
                  <button
                    className="btn btn-warning btn-small text-white mb-2"
                    onClick={() => setClub(null)}
                  >
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

            {(opponentClubs || isOpponentLoading) && (
              <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2 fade-in">
                <div className="d-flex flex-row flex-md-grow-0">
                  <h4 className="flex-grow-1">My opponents</h4>
                </div>

                {isOpponentLoading && (
                  <div className="ratio ratio-16x9 w-100">
                    <LoadingSquare />
                  </div>
                )}

                {!isOpponentLoading && (
                  <div className="d-flex flex-column flex-md-grow-1 overflow-auto">
                    {opponentClubs.map((c) => (
                      <div className="my-1">
                        <ItemCardClub
                          id={c.id}
                          name={c.name}
                          text={
                            c.playCount +
                            " match" +
                            (c.playCount > 1 ? "es" : "")
                          }
                          onClick={(id) => setSelectedOpponentId(id)}
                          selected={c.id === selectedOpponentId}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="d-flex flex-column flex-md-grow-0 flex-basis-300">
            {opponentMatches && (
              <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 m-2 p-3 pt-2 fade-in">
                <div className="d-flex flex-row">
                  <h4 className="flex-grow-1">Matches</h4>
                </div>

                <div className="d-flex flex-fill flex-column">
                  {opponentMatches &&
                    opponentMatches.map((m) => (
                      <div className="my-1">
                        <ItemCardMatch
                          match={m}
                          onClick={(id) => {
                            if (selectedOpponentMatchIds.indexOf(id) >= 0) {
                              setSelectedOpponentMatchIds(
                                selectedOpponentMatchIds.filter((i) => i !== id)
                              );
                            } else {
                              setSelectedOpponentMatchIds([
                                ...selectedOpponentMatchIds,
                                ...[id],
                              ]);
                            }
                          }}
                          selected={selectedOpponentMatchIds.indexOf(m.id) >= 0}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="d-flex flex-column flex-md-column flex-md-column-reverse flex-md-grow-1">
            {false && (
              <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 m-2 p-3 pt-2 fade-in">
                <div className="d-flex flex-row">
                  <h4 className="flex-grow-1">Analysis</h4>
                </div>

                <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-1x1"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsMatchObservatory;
