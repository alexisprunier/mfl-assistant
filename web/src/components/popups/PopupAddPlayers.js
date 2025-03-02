import BoxMessage from "components/box/BoxMessage.js";
import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { getPlayers } from "services/api-assistant.js";

interface PopupAddPlayersProps {
  trigger: Object;
  onClose: func;
  onConfirm: func;
  userId?: string;
}

const PopupAddPlayers: React.FC<PopupAddPlayersProps> = ({
  trigger,
  onClose,
  onConfirm,
  userId,
}) => {
  const [selectedTab, setSelectedTab] = useState("my-players");

  const [defaultFilters] = useState({
    search: "",
    firstPositionOnly: false,
    positions: undefined,
    minAge: undefined,
    maxAge: undefined,
    minOvr: undefined,
    maxOvr: undefined,
  });
  const [filters, setFilters] = useState(defaultFilters);

  const [players, setPlayers] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [playerView, setPlayerView] = useState(null);
  const [userPlayerOnly, setUserPlayerOnly] = useState(true);
  const [hidePlayersInTeams, setHidePlayersInTeams] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const confirm = (close) => {
    if (onConfirm) {
      onConfirm(selectedPlayers);
    }

    setSelectedPlayers([]);
    close();
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
        setCanLoadMore(v.data.getPlayers.length === 20);
      },
      params: {
        ...filters,
        owners: userPlayerOnly ? [userId] : null,
        ignorePlayersInTeams: hidePlayersInTeams,
        limit: 20,
        skip: 20 * (page - 1),
      },
    });
  };

  const loadMore = () => {
    fetchPlayers(Math.round(players.length / 20) + 1);
  };

  const onPlayerSelection = (p) => {
    if (selectedPlayers.map((p) => p.id).indexOf(p.id) >= 0) {
      setSelectedPlayers(selectedPlayers.filter((l) => l.id !== p.id));
    } else {
      setSelectedPlayers(selectedPlayers.concat(p));
    }
  };

  const countFilters = (p) => {
    return Object.keys(filters).reduce((count, key) => {
      if (
        key !== "search" &&
        filters[key] != null &&
        filters[key] != false &&
        filters[key] !== "" &&
        (!Array.isArray(filters[key]) || filters[key].length > 0)
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  useEffect(() => {
    setPlayers(null);
    setSelectedPlayers([]);
    setCanLoadMore(false);

    fetchPlayers();
  }, [userPlayerOnly, hidePlayersInTeams]);

  return (
    <div className="PopupAddPlayers">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick={false}
        onOpen={() => setSelectedTab("my-players")}
        onClose={onClose}
        className={"fade-in popup-xl"}
      >
        {(close) => (
          <div className="container bg-dark d-flex flex-column border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row flex-grow-0 mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">Add players</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-column flex-grow-1 overflow-auto">
              <div className="d-flex flex-row flex-grow-0 mb-3">
                <input
                  type="text"
                  className="form-control me-1"
                  value={filters.search}
                  onChange={(v) =>
                    setFilters({ ...filters, search: v.target.value })
                  }
                  placeholder={"Name"}
                  autoFocus
                />
                <FilterContainerPlayer
                  trigger={
                    <button className="d-flex flex-row btn btn-info text-white me-1">
                      <i className="bi bi-filter-square-fill" />
                      {countFilters() > 0 ? (
                        <div className="ms-2">{countFilters()}</div>
                      ) : (
                        ""
                      )}
                    </button>
                  }
                  filters={filters}
                  onChange={(f) => setFilters(f)}
                  onApply={() => fetchPlayers()}
                  showPositions={true}
                  showOverallScore={true}
                  showAge={true}
                  deactivateNavigate={true}
                />
                {(countFilters() > 0 || filters.search) && (
                  <button
                    className="btn btn-warning text-white me-1"
                    onClick={() => setFilters(defaultFilters)}
                  >
                    <i className="bi bi-x-square-fill text-white"></i>
                  </button>
                )}
                <button
                  className="btn btn-info text-white"
                  onClick={() => fetchPlayers()}
                >
                  <i className="bi bi-search text-white"></i>
                </button>
              </div>

              <div className="d-flex flex-grow-0 justify-content-end mb-3">
                <small>
                  Hide players in teams
                  <input
                    type="checkbox"
                    className="ms-1 me-2"
                    defaultChecked={hidePlayersInTeams}
                    value={hidePlayersInTeams}
                    onChange={() => setHidePlayersInTeams(!hidePlayersInTeams)}
                  />
                </small>
                <small>
                  My players only
                  <input
                    type="checkbox"
                    className="ms-1"
                    defaultChecked={userPlayerOnly}
                    value={userPlayerOnly}
                    onChange={() => setUserPlayerOnly(!userPlayerOnly)}
                  />
                </small>
                <ButtonPlayerView
                  selectedView={playerView}
                  onChange={(v) => setPlayerView(v)}
                />
              </div>

              <div className="d-flex flex-grow-1 flex-column overflow-auto">
                {players &&
                  players.length > 0 &&
                  players.map((p) => (
                    <div>
                      <ItemRowPlayerAssist
                        p={p}
                        display={playerView}
                        isSelected={
                          selectedPlayers.map((p) => p.id).indexOf(p.id) >= 0
                        }
                        onSelect={(p) => onPlayerSelection(p)}
                      />
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

            <div className="d-flex flex-grow-0 flex-row justify-content-end mt-3">
              <div>
                {selectedPlayers.length > 0 && (
                  <button
                    className="btn btn-warning text-white me-1"
                    onClick={() => setSelectedPlayers([])}
                  >
                    <i className="bi bi-x-square-fill text-white"></i>
                  </button>
                )}
                <button
                  className="btn btn-info text-white"
                  disabled={selectedPlayers.length <= 0}
                  onClick={() => confirm(close)}
                >
                  Confirm{" "}
                  {selectedPlayers.length > 0 && `(${selectedPlayers.length})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupAddPlayers;
