import BoxMessage from "components/box/BoxMessage.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { getPlayers } from "services/api-assistant.js";

interface PopupPlayersProps {
  trigger: Object;
  onClose: func;
  filters?: Object;
  open?: Boolean;
}

const PopupPlayers: React.FC<PopupPlayersProps> = ({
  trigger,
  onClose,
  filters,
  open,
}) => {
  const [players, setPlayers] = useState(null);
  const [playerView, setPlayerView] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const onOpen = () => {
    setPlayers(null);
  };

  const fetchPlayers = (page = 1) => {
    setIsLoading(true);

    if (page === 1) {
      setPlayers(null);
    }

    getPlayers({
      handleSuccess: (v) => {
        if (page === 1) {
          setPlayers(v.data.getPlayers);
        } else {
          setPlayers(
            players ? players.concat(v.data.getPlayers) : v.data.getPlayers
          );
        }

        setIsLoading(false);
        setCanLoadMore(v.data.getPlayers.length === 50);
      },
      params: {
        ...filters,
        limit: 50,
        skip: 50 * (page - 1),
      },
    });
  };

  const loadMore = () => {
    fetchPlayers(Math.round(players.length / 50) + 1);
  };

  useEffect(() => {
    if (players === null) {
      fetchPlayers();
    }
  }, [players]);

  return (
    <div className="PopupAddPlayers">
      <Popup
        trigger={trigger}
        modal
        open={open}
        closeOnDocumentClick={false}
        onOpen={() => onOpen()}
        onClose={onClose}
        className={"fade-in popup-xl"}
      >
        {(close) => (
          <div className="container bg-dark d-flex flex-column border border-3 rounded-3 p-4">
            <div className="d-flex flex-row flex-grow-0 mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Players</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-grow-0 justify-content-end mb-3">
              <ButtonPlayerView
                selectedView={playerView}
                onChange={(v) => setPlayerView(v)}
              />
            </div>

            <div className="d-flex flex-column flex-grow-1 overflow-auto">
              <div className="d-flex flex-grow-1 flex-column overflow-auto">
                {players &&
                  players.length > 0 &&
                  players.map((p) => (
                    <div>
                      <ItemRowPlayerAssist p={p} display={playerView} />
                    </div>
                  ))}

                {players && players.length === 0 && (
                  <BoxMessage content={"No player found"} />
                )}

                {!players && (
                  <div style={{ height: "200px" }}>
                    <LoadingSquare />
                  </div>
                )}

                {players && isLoading && (
                  <div style={{ height: "30px" }}>
                    <LoadingSquare />
                  </div>
                )}

                {canLoadMore && !isLoading && (
                  <button
                    className="btn btn-sm btn-link align-self-start"
                    onClick={() => loadMore()}
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupPlayers;
