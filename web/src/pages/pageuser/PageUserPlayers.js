import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPlayers } from "services/api-assistant.js";

interface PageUserPlayersProps {}

const PageUserPlayers: React.FC<PageUserPlayersProps> = () => {
  const user = useOutletContext();
  const [players, setPlayers] = useState(null);
  const [playerPage, setPlayerPage] = useState(0);
  const [canLoadMorePlayers, setCanLoadMorePlayers] = useState(true);

  const [playerView, setPlayerView] = useState(null);

  const fetchPlayers = () => {
    getPlayers({
      handleSuccess: (d) => {
        if (!players) {
          setPlayers(d.data.getPlayers);
        } else {
          setPlayers(players.concat(d.data.getPlayers));
        }

        if (d.data.getPlayers.length < 500) setCanLoadMorePlayers(false);

        setPlayerPage(playerPage + 1);
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id], skip: playerPage * 500 },
    });
  };

  useEffect(() => {
    if (user != null) {
      fetchPlayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      fetchPlayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="PageUserPlayers">
      <div className="container max-width-md px-4 py-5">
        <div className="card d-flex mb-3 p-3 pt-2">
          <div className="d-flex flex-column">
            <div className="d-flex flex-column flex-md-row mb-3">
              <div className="h4 flex-grow-1">
                <i className="bi bi-person-badge-fill mx-1" /> Players
              </div>

              {user && players !== null && (
                <div className="d-flex justify-content-end">
                  <ButtonPlayerView
                    selectedView={playerView}
                    onChange={(v) => setPlayerView(v)}
                  />
                </div>
              )}
            </div>

            {user && players !== null && (
              <div>
                {players.map((c) => (
                  <ItemRowPlayerAssist p={c} display={playerView} />
                ))}
              </div>
            )}

            {(!user || players === null) && (
              <div style={{ height: 300 }}>
                <LoadingSquare height={300} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUserPlayers;
