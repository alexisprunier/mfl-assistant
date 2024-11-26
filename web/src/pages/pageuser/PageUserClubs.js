import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import LoadingSquare from "components/loading/LoadingSquare";
import { getClubs, getUsers } from "services/api-assistant.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import ItemRowUser from "components/items/ItemRowUser.js";
import BoxMessage from "components/box/BoxMessage.js";
import { useParams, useOutletContext } from 'react-router-dom';

interface PageUserClubsProps {}

const PageUserClubs: React.FC < PageUserClubsProps > = () => {

  const user = useOutletContext();
  const [clubs, setClubs] = useState(null);
  const [clubPage, setClubPage] = useState(0);
  const [canLoadMoreClubs, setCanLoadMoreClubs] = useState(true);

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

  return (
    <div id="PageUserClubs">
      <div className="container max-width-md px-4 py-5">
        <div className="card d-flex mb-3 p-3 pt-2">
          <div className="d-flex flex-column">
            <div className="d-flex flex-column flex-md-row mb-3">
              <div className="h4 flex-grow-1">
                <i className="bi bi-buildings-fill mx-1"/> Clubs
              </div>
            </div>

            {user && clubs !== null
              && <div>
                {clubs.map((c) => (
                  <ItemRowClub
                    c={c}
                  />
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