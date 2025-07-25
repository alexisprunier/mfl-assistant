import ButtonMflCompetition from "components/buttons/ButtonMflCompetition.js";
import ButtonMflManagerProjection from "components/buttons/ButtonMflManagerProjection.js";
import BoxCard from "components/box/BoxCard.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import LoadingSquare from "components/loading/LoadingSquare";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getClubs } from "services/api-assistant.js";
import { getClubStandings, getClubCompetitions } from "services/api-mfl.js";

interface PageUserClubsProps {}

const PageUserClubs: React.FC<PageUserClubsProps> = () => {
  const user = useOutletContext();
  const [clubs, setClubs] = useState(null);
  const [clubToDisplay, setClubToDisplay] = useState(null);
  const [canLoadMoreClubs, setCanLoadMoreClubs] = useState(false);

  const [standings, setStandings] = useState({});
  const [competitions, setCompetitions] = useState({});

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs.sort((a, b) => a.division - b.division));
        if (d.data.getClubs.length > canLoadMoreClubs) {
          setCanLoadMoreClubs(true);
          setClubToDisplay(3);
        }
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id] },
    });
  };

  const showMoreClubs = () => {
    if (clubs.length <= clubToDisplay + 6) {
      setCanLoadMoreClubs(false);
    }

    setClubToDisplay(clubToDisplay + 6);
  };

  useEffect(() => {
    if (user !== null) {
      fetchClubs();
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      fetchClubs();
    }
  }, []);

  useEffect(() => {
    if (clubs) {
      const clubIds = clubs.slice(0, clubToDisplay).map((c) => c.id);
      let remainingIds = [...clubIds];

      const fetchNextStanding = () => {
        const nextId = remainingIds[0];
        remainingIds = remainingIds.slice(1);

        if (nextId) {
          if (Object.keys(standings).includes(nextId + "")) {
            fetchNextStanding();
            return;
          }

          getClubStandings({
            handleSuccess: (v) => {
              setStandings((prevStandings) => ({
                ...prevStandings,
                [nextId]: v,
              }));
              fetchNextStanding();
            },
            handleError: (e) => {
              console.log(`Error fetching standings for club ID ${nextId}:`, e);
              fetchNextStanding();
            },
            params: { id: nextId },
          });
        }
      };

      fetchNextStanding();
    }
  }, [clubToDisplay]);

  useEffect(() => {
    if (clubs) {
      const clubIds = clubs.slice(0, clubToDisplay).map((c) => c.id);
      let remainingIds = [...clubIds];

      const fetchNextCompetitions = () => {
        const nextId = remainingIds[0];
        remainingIds = remainingIds.slice(1);

        if (nextId) {
          if (Object.keys(competitions).includes(nextId + "")) {
            fetchNextCompetitions();
            return;
          }

          getClubCompetitions({
            handleSuccess: (v) => {
              setCompetitions((prevCompetitions) => ({
                ...prevCompetitions,
                [nextId]: v,
              }));
              fetchNextCompetitions();
            },
            handleError: (e) => {
              console.log(`Error fetching competitions for club ID ${nextId}:`, e);
              fetchNextCompetitions();
            },
            params: { id: nextId },
          });
        }
      };

      fetchNextCompetitions();
    }
  }, [clubToDisplay]);

  const getStandingsBlock = (data) => {
    return (
      <div className="card bg-black pt-1 p-2 mb-2">
        <div className="d-flex flex-grow-1 flex-column flex-md-row">
          <div className="d-flex flex-grow-1 h5 mb-0">{data.name}</div>
          <div className="d-flex flex-grow-0 justify-content-end">
            <div className="me-1">
              <ButtonMflManagerProjection name={data.name} />{" "}
            </div>
            <div>
              <ButtonMflCompetition id={data.id} />
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex flex-row align-items-right">
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              #
            </div>
            <div className="flex-grow-1">Club</div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              W
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              D
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              L
            </div>
            <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>
              Pts
            </div>
          </div>{" "}
          {data.standings.map((standing, index) => (
            <div
              key={standing.club.id}
              className={
                "d-flex justify-content-between align-items-right border-top " +
                (Object.keys(standings).includes(String(standing.club.id)) ? "bg-info text-dark" : "")
              }
            >
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
                {index + 1}
              </div>
              <div className="d-flex justify-content-center" style={{ minWidth: 25 }}>
                <img
                  className="mt-1"
                  src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${standing.club.id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
                  alt={`${standing.club.name} logo`}
                  style={{ width: "15px", height: "15px" }}
                />
              </div>
              <div className="d-flex flex-fill text-truncate" style={{ minWidth: 0 }}>
                <div className="d-flex text-truncate" style={{ minWidth: 0 }}>
                  <div className="text-truncate" style={{ minWidth: 0 }}>
                    {standing.club.name}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
                {standing.wins}
              </div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
                {standing.draws}
              </div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
                {standing.losses}
              </div>
              <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>
                {standing.points}
              </div>
            </div>
          ))}{" "}
        </div>{" "}
      </div>
    );
  };

  const getCompetitionBlock = (id, name, data) => {
    const cup = data.filter((d) => d.type === "CUP").shift();

    if (!cup) {
      return "";
    }

    return (
      <div className="card bg-black pt-1 p-2 mb-2">
        <div className="d-flex flex-grow-1 flex-column flex-md-row">
          <div className="d-flex flex-grow-1 h5 mb-0">{cup.name}</div>
          <div className="d-flex flex-grow-0 justify-content-end">
            <div>
              <ButtonMflCompetition id={cup.id} />
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex flex-row align-items-right">
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}></div>
            <div className="flex-grow-1">Club</div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              W
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              D
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              L
            </div>
            <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>
              Pts
            </div>
          </div>

          <div key={id} className={"d-flex justify-content-between align-items-right border-top"}>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}></div>
            <div className="d-flex justify-content-center" style={{ minWidth: 25 }}>
              <img
                className="mt-1"
                src={`https://d13e14gtps4iwl.cloudfront.net/u/clubs/${id}/logo.png?v=63c386597972f1fcbdcef019a7b453c8`}
                alt={`${name} logo`}
                style={{ width: "15px", height: "15px" }}
              />
            </div>
            <div className="d-flex flex-fill text-truncate" style={{ minWidth: 0 }}>
              <div className="d-flex text-truncate" style={{ minWidth: 0 }}>
                <div className="text-truncate" style={{ minWidth: 0 }}>
                  {name}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              {cup.stats?.wins || 0}
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              {cup.stats?.draws || 0}
            </div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>
              {cup.stats?.losses || 0}
            </div>
            <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>
              {cup.stats?.points || 0}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="PageUserClubs">
      <div className="container-fluid px-4 py-4">
        {user && clubs !== null && (
          <div className="row">
            <div className="col-12">
              <BoxCard className="pb-0" title={clubs.length + " club" + (clubs.length > 0 ? "s" : "")} />
            </div>
            {clubs.slice(0, clubToDisplay).map((c) => (
              <div className="col-12 col-lg-6 col-xxl-4">
                <BoxCard
                  content={
                    <div className="d-flex flex-column w-100">
                      <ItemRowClub c={c} />

                      <div className="mt-2">
                        {standings[c.id] ? (
                          getStandingsBlock(standings[c.id])
                        ) : (
                          <div style={{ height: 300 }}>
                            <LoadingSquare height={300} />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        {competitions[c.id] ? (
                          getCompetitionBlock(c.id, c.name, competitions[c.id])
                        ) : (
                          <div style={{ height: 50 }}>
                            <LoadingSquare height={50} />
                          </div>
                        )}
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        )}

        {(!user || clubs === null) && (
          <div style={{ height: 60 }}>
            <BoxCard className={"h-100"} content={<LoadingSquare height={60} />} />
          </div>
        )}

        {canLoadMoreClubs && (
          <div className="d-flex w-100 justify-content-end">
            <button className="btn btn-info text-white mt-2 me-3" onClick={() => showMoreClubs()}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageUserClubs;
