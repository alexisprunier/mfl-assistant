import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getPlayers, getPlayerPricings } from "services/api-assistant.js";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import PopupInformationPricing from "components/popups/PopupInformationPricing.js";
import BoxCard from "components/box/BoxCard.js";

interface PageUserPlayersProps {}

const PageUserPlayers: React.FC<PageUserPlayersProps> = () => {
  const user = useOutletContext();

  const [defaultFilters] = useState({
    firstPositionOnly: false,
    positions: undefined,
    minAge: undefined,
    maxAge: undefined,
    minOvr: undefined,
    maxOvr: undefined,
  });
  const [filters, setFilters] = useState(defaultFilters);

  const [players, setPlayers] = useState(null);
  const [pricings, setPricings] = useState([]);

  const [playerView, setPlayerView] = useState(null);

  const fetchPlayers = () => {
    setPlayers(null);

    getPlayers({
      handleSuccess: (d) => {
        setPlayers(d.data.getPlayers);
      },
      handleError: (e) => console.log(e),
      params: {
        ...filters,
        owners: [user.id],
        limit: 50000,
      },
    });
  };

  const fetchPricings = () => {
    getPlayerPricings({
      handleSuccess: (d) => {
        if (d.data.getPlayerPricings) {
          setPricings(d.data.getPlayerPricings);
        }
      },
      handleError: (e) => console.log(e),
    });
  };

  const getPricing = (player) => {
    return pricings
      .filter((p) => p.overall === player.overall && p.age === player.age && p.position === player.positions[0])
      .map((p) => p.price)
      .pop();
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

  const calculateTotalPricing = (players) => {
    let total = 0;
    let allValid = true;

    for (const player of players) {
      const price = getPricing(player);

      if (price === undefined || price === null) {
        allValid = false;
      } else {
        total += price;
      }
    }

    return { total, complete: allValid };
  };

  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPlayers();
    }

    fetchPricings();
  }, []);

  useEffect(() => {
    if (user && filters === defaultFilters) {
      fetchPlayers();
    }
  }, [filters]);

  return (
    <div id="PageUserPlayers">
      <div className="container max-width-lg px-4 py-4">
        <BoxCard
          title={
            <div>
              <i className="bi bi-person-badge-fill mx-1" /> Players
            </div>
          }
          actions={
            user &&
            players !== null && (
              <div className="d-flex justify-content-end">
                <ButtonPlayerView selectedView={playerView} onChange={(v) => setPlayerView(v)} displayPricing={true} />
              </div>
            )
          }
          content={
            <div className="d-flex flex-fill flex-column mt-2">
              <div className="d-flex flex-column flex-md-row">
                <div className="d-flex flex-grow-1 align-items-center mb-3 me-2">
                  {pricings && players ? (
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-row">
                        <span className="me-1">Estimated gallery value:</span>
                        <PopupInformationPricing />
                        &nbsp;
                        <span className="text-info me-1">${calculateTotalPricing(players).total}</span>
                      </div>
                      {!calculateTotalPricing(players).complete && <div>Pricing is missing for some players</div>}
                    </div>
                  ) : (
                    <LoadingSquare />
                  )}
                </div>
                <div className="d-flex flex-grow-0 justify-content-end mb-3">
                  {players && <div className="d-flex align-items-center me-2">{players.length} players</div>}
                  <FilterContainerPlayer
                    trigger={
                      <button className="d-flex flex-row btn btn-info text-white me-1">
                        <i className="bi bi-filter-square-fill" />
                        {countFilters() > 0 ? <div className="ms-2">{countFilters()}</div> : ""}
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
                  {countFilters() > 0 && (
                    <button
                      className="btn btn-warning text-white me-1"
                      onClick={() => {
                        setFilters(defaultFilters);
                      }}
                    >
                      <i className="bi bi-x-square-fill text-white"></i>
                    </button>
                  )}
                </div>
              </div>

              {user && players !== null && (
                <div>
                  {players.map((c) => (
                    <ItemRowPlayerAssist p={c} display={playerView} pricing={getPricing(c)} />
                  ))}
                </div>
              )}

              {(!user || players === null) && (
                <div style={{ height: 300 }}>
                  <LoadingSquare height={300} />
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default PageUserPlayers;
