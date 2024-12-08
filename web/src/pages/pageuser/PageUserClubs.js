import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import LoadingSquare from "components/loading/LoadingSquare";
import { getClubs, getUsers } from "services/api-assistant.js";
import { getClubStandings } from "services/api-mfl.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import ItemRowUser from "components/items/ItemRowUser.js";
import ButtonMflCompetition from "components/buttons/ButtonMflCompetition.js";
import BoxMessage from "components/box/BoxMessage.js";
import { useParams, useOutletContext } from 'react-router-dom';

interface PageUserClubsProps {}

const PageUserClubs: React.FC < PageUserClubsProps > = () => {

    const user = useOutletContext();
    const [clubs, setClubs] = useState(null);
    const [clubPage, setClubPage] = useState(0);
    const [canLoadMoreClubs, setCanLoadMoreClubs] = useState(true);

    const [standings, setStandings] = useState({});
    const [displayStandings, setDisplayStandings] = useState(false);

    const fetchClubs = () => {
      getClubs({
        handleSuccess: (d) => {
          if (!clubs) {
            setClubs(d.data.getClubs);
          } else {
            setClubs(clubs.concat(d.data.getClubs));
          }

          if (d.data.getClubs.length < 500)
            setCanLoadMoreClubs(false);

          setClubPage(clubPage + 1)
        },
        handleError: (e) => console.log(e),
        params: { owners: [user.id], skip: clubPage * 500 },
      });
    }

    useEffect(() => {
      if (user !== null) {
        fetchClubs();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
      if (user !== null) {
        fetchClubs();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (displayStandings) {
        setStandings({});

        const clubIds = clubs.map((c) => c.id);
        let remainingIds = [...clubIds];

        const fetchNextStanding = () => {
          const nextId = remainingIds[0];
          remainingIds = remainingIds.slice(1);

          if (nextId) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayStandings]);

    const getStandingsBlock = (data) => {
        return <div className="card bg-black pt-1 p-2 mb-2">
        <div className="d-flex flex-grow-1 flex-column flex-md-row">
          <div className="d-flex flex-grow-1 h5 mb-0">
            {data.name}
          </div>
          <div className="d-flex flex-grow-0 justify-content-end">
            <ButtonMflCompetition id={data.id}/>
          </div>
        </div>

      <div>
      <div className="d-flex flex-row align-items-right">
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>#</div>
            <div className="flex-grow-1">Club</div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>W</div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>D</div>
            <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>L</div>
            <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>Pt</div>
            <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>GA</div>
          </div> {
        data.standings.map((standing, index) => (
          <div
              key={standing.club.id}
              className={
                "d-flex justify-content-between align-items-right border-top "
                + (Object.keys(standings).includes(String(standing.club.id)) ? "bg-info text-dark" : "")
              }
            >
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>{index + 1}</div>
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
                  <div className="text-truncate" style={{ minWidth: 0 }}>{standing.club.name}</div>
                </div>
              </div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>{standing.wins}</div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>{standing.draws}</div>
              <div className="d-flex justify-content-center" style={{ minWidth: 30 }}>{standing.losses}</div>
              <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>{standing.points}</div>
              <div className="d-flex justify-content-end" style={{ minWidth: 30 }}>{standing.goalsAgainst}</div>
            </div>
        ))
      } <
      /div> < /
      div >
    ;
  }

  return (
    <div id="PageUserClubs">
      <div className="container max-width-md px-4 py-5">
        <div className="card d-flex mb-3 p-3 pt-2">
          <div className="d-flex flex-column">
            <div className="d-flex flex-column flex-md-row mb-3">
              <div className="h4 flex-grow-1">
                <i className="bi bi-buildings-fill mx-1"/> Clubs
              </div>

              <div className="d-flex flex-grow-0 justify-content-end">
                <small>
                  Display standings
                  <input
                    type="checkbox"
                    className="ms-1"
                    defaultChecked={displayStandings}
                    value={displayStandings}
                    onChange={() => setDisplayStandings(!displayStandings)}
                  />
                </small>
              </div>
            </div>

            {user && clubs !== null
              && <div>
                {clubs.map((c) => (
                  <div>
                    <ItemRowClub
                      c={c}
                    />

                    {displayStandings
                      && <div>
                      {standings[c.id]
                        ? getStandingsBlock(standings[c.id])
                        : <div style={{ height: 300 }}>
                          <LoadingSquare />
                        </div>
                      }
                    </div>}
                  </div>

                ))}
              </div>
            }

            {(!user || clubs === null)
              && <div style={{ height: 300 }}>
                <LoadingSquare
                  height={300}
                />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUserClubs;