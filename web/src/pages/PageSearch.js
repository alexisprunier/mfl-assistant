import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingSquare from "components/loading/LoadingSquare";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import { getClubs, getPlayers, getUsers } from "services/api-assistant.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import ItemRowUser from "components/items/ItemRowUser.js";
import BoxMessage from "components/box/BoxMessage.js";

interface PageSearchProps {}

const PageSearch: React.FC < PageSearchProps > = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [fieldValue, setFieldValue] = useState("");
  const [searchValue, setSearchValue] = useState(null);

  const [players, setPlayers] = useState(null);
  const [clubs, setClubs] = useState(null);
  const [users, setUsers] = useState(null);

  const [playerPage, setPlayerPage] = useState(0);
  const [clubPage, setClubPage] = useState(0);
  const [userPage, setUserPage] = useState(0);

  const [canLoadMorePlayers, setCanLoadMorePlayers] = useState(true);
  const [canLoadMoreClubs, setCanLoadMoreClubs] = useState(true);
  const [canLoadMoreUsers, setCanLoadMoreUsers] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const search = () => {
    if (searchValue && searchValue.length > 2) {
      navigate({ search: '?q=' + searchValue });

      flushSync(() => {
        setIsLoading(true);

        setClubs(null);
        setPlayers(null);
        setUsers(null);

        setPlayerPage(0);
        setClubPage(0);
        setUserPage(0);

        setCanLoadMorePlayers(true);
        setCanLoadMoreClubs(true);
        setCanLoadMoreUsers(true);
      });

      const promises = [
        new Promise((resolve, reject) => {
          fetchClubs();
          resolve();
        }),
        new Promise((resolve, reject) => {
          fetchPlayers();
          resolve();
        }),
        new Promise((resolve, reject) => {
          fetchUsers();
          resolve();
        }),
      ]

      Promise.all(promises).then((values) => {
        setIsLoading(false);
      });
    }
  };

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        if (!clubs) {
          setClubs(d.data.getClubs);
        } else {
          setClubs(clubs.concat(d.data.getClubs));
        }

        if (d.data.getClubs.length < 10)
          setCanLoadMoreClubs(false);

        setClubPage(clubPage + 1)
      },
      handleError: (e) => console.log(e),
      params: { search: searchValue, skip: clubPage * 10 },
    });
  }

  const fetchPlayers = () => {
    getPlayers({
      handleSuccess: (d) => {
        if (!players) {
          setPlayers(d.data.getPlayers);
        } else {
          setPlayers(players.concat(d.data.getPlayers));
        }

        if (d.data.getPlayers.length < 10)
          setCanLoadMorePlayers(false);

        setPlayerPage(playerPage + 1)
      },
      handleError: (e) => console.log(e),
      params: { search: searchValue, skip: playerPage * 10 },
    });
  }

  const fetchUsers = () => {
    getUsers({
      handleSuccess: (d) => {
        if (!users) {
          setUsers(d.data.getUsers);
        } else {
          setUsers(users.concat(d.data.getUsers));
        }

        if (d.data.getUsers.length < 10)
          setCanLoadMoreUsers(false);

        setUserPage(userPage + 1)
      },
      handleError: (e) => console.log(e),
      params: { search: searchValue, skip: userPage * 10 },
    });
  }

  useEffect(() => {
    if (searchParams.get("q")) {
      setFieldValue(searchParams.get("q"));
      setSearchValue(searchParams.get("q"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue && searchValue.length > 2) {
      setClubs(null);
      setPlayers(null);
      setUsers(null);
      setIsLoading(true);
      setPlayerPage(0);
      setClubPage(0);
      setUserPage(0);
      setCanLoadMorePlayers(true);
      setCanLoadMoreClubs(true);
      setCanLoadMoreUsers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (searchValue && searchValue.length > 2 &&
      playerPage === 0 && clubPage === 0 &&
      clubs === null && players === null) {
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, playerPage, players, clubPage, clubs]);

  return (
    <div id="PageSearch">
      <div className="container max-width-md px-4 py-5">
        <div className="row mb-4">
          <div className="col flex-grow-1">
            <input
              type="text"
              className="form-control w-100"
              value={fieldValue}
              onChange={(v) => setFieldValue(v.target.value)}
              placeholder={"Search players, clubs, users..."}
              autoFocus
            />
          </div>

          <div className="col flex-grow-0">
            <button
              type="text"
              className="btn btn-info w-100"
              onClick={() => setSearchValue(fieldValue)}
              disabled={fieldValue.length < 2}
            >
              <i className="bi bi-search text-white"></i>
            </button>
          </div>
        </div>

        {isLoading
          && <div className="row">
            <div className="col-3 mb-4">
              <div className="ratio ratio-16x9">
                <LoadingSquare />
              </div>
            </div>
            <div className="col-3">
              <div className="ratio ratio-16x9">
                <LoadingSquare />
              </div>
            </div>
            <div className="col-3">
              <div className="ratio ratio-16x9">
                <LoadingSquare />
              </div>
            </div>

            <div className="col-4">
              <div className="ratio ratio-16x9">
                <LoadingSquare />
              </div>
            </div>
            <div className="col-4">
              <div className="ratio ratio-16x9">
                <LoadingSquare />
              </div>
            </div>
          </div>
        }

        {!isLoading && clubs && clubs.length > 0
          && <div className="card d-flex mb-3 p-3 pt-2">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <div className="h4 flex-grow-1">
                  Clubs
                </div>
              </div>

              {clubs.map((c) => (
                <ItemRowClub
                  c={c}
                />
              ))}

              {canLoadMoreClubs
                && <button
                className="btn btn-sm btn-link align-self-start"
                  onClick={() => { fetchClubs() }}
                >
                  Load more
                </button>
              }
            </div>
          </div>
        }

        {!isLoading && users && users.length > 0
          && <div className="card d-flex mb-3 p-3 pt-2">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <div className="h4 flex-grow-1">
                  Users
                </div>
              </div>

              {users.map((c) => (
                <ItemRowUser
                  c={c}
                />
              ))}

              {canLoadMoreUsers
                && <button
                className="btn btn-sm btn-link align-self-start"
                  onClick={() => { fetchUsers() }}
                >
                  Load more
                </button>
              }
            </div>
          </div>
        }

        {!isLoading && players && players.length > 0
          && <div className="card d-flex mb-3 p-3 pt-2">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <div className="h4 flex-grow-1">
                  Players
                </div>
              </div>

              {players.map((c) => (
                <ItemRowPlayerAssist
                  p={c}
                />
              ))}

              {canLoadMorePlayers
                && <button
                className="btn btn-sm btn-link align-self-start"
                  onClick={() => { fetchPlayers() }}
                >
                  Load more
                </button>
              }
            </div>
          </div>
        }

        {!isLoading
          && (clubs && clubs.length === 0)
          && (players && players.length === 0)
          && (users && users.length === 0)
          && <div className="my-5">
            <BoxMessage
              content={"No result found"}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default PageSearch;