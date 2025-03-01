import BoxMessage from "components/box/BoxMessage.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemRowUser from "components/items/ItemRowUser.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare";
import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getClubs, getPlayers, getUsers } from "services/api-assistant.js";

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

  const search = async () => {
    if (searchValue && searchValue.length > 2) {
      navigate({ search: "?q=" + searchValue });

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

      try {
        await Promise.all([fetchClubs(), fetchPlayers(), fetchUsers()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchClubs = () => {
    return new Promise((resolve, reject) => {
      getClubs({
        handleSuccess: (d) => {
          if (!clubs) {
            setClubs(d.data.getClubs);
          } else {
            setClubs(clubs.concat(d.data.getClubs));
          }

          if (d.data.getClubs.length < 10) setCanLoadMoreClubs(false);

          setClubPage(clubPage + 1);
          resolve();
        },
        handleError: (e) => {
          console.error(e);
          reject(e);
        },
        params: { search: searchValue, limit: 10, skip: clubPage * 10 },
      });
    });
  };

  const fetchPlayers = () => {
    return new Promise((resolve, reject) => {
      getPlayers({
        handleSuccess: (d) => {
          if (!players) {
            setPlayers(d.data.getPlayers);
          } else {
            setPlayers(players.concat(d.data.getPlayers));
          }

          if (d.data.getPlayers.length < 10) setCanLoadMorePlayers(false);

          setPlayerPage(playerPage + 1);
          resolve();
        },
        handleError: (e) => {
          console.error(e);
          reject(e);
        },
        params: { search: searchValue, limit: 10, skip: playerPage * 10 },
      });
    });
  };

  const fetchUsers = () => {
    return new Promise((resolve, reject) => {
      getUsers({
        handleSuccess: (d) => {
          if (!users) {
            setUsers(d.data.getUsers);
          } else {
            setUsers(users.concat(d.data.getUsers));
          }

          if (d.data.getUsers.length < 10) setCanLoadMoreUsers(false);

          setUserPage(userPage + 1);
          resolve();
        },
        handleError: (e) => {
          console.error(e);
          reject(e);
        },
        params: { search: searchValue, skip: userPage * 10 },
      });
    });
  };

  useEffect(() => {
    if (searchParams.get("q")) {
      setFieldValue(searchParams.get("q"));
      setSearchValue(searchParams.get("q"));
    }
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
  }, [searchValue]);

  useEffect(() => {
    if (
      searchValue &&
      searchValue.length > 2 &&
      playerPage === 0 &&
      clubPage === 0 &&
      clubs === null &&
      players === null
    ) {
      search();
    }
  }, [searchValue, playerPage, players, clubPage, clubs]);

  return (
    <div id="PageSearch">
      <div className="container max-width-md px-4 py-5">
        <BoxCard
          className="mb-4"
          content={
            <div className="d-flex w-100">
              <div className="d-flex flex-grow-1">
                <input
                  type="text"
                  className="form-control w-100 me-2"
                  value={fieldValue}
                  onChange={(v) => setFieldValue(v.target.value)}
                  placeholder={"Search players, clubs, users..."}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && fieldValue.length >= 2) {
                      setSearchValue(fieldValue);
                    }
                  }}
                />
              </div>

              <div className="d-flex flex-grow-0">
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
  }
  />

  {
    (isLoading || (users && users.length > 0)) && (
      <BoxCard
            className="mb-3"
            title="Users"
            content={
              !users || users.length === 0 ? (
                <div className="d-flex ratio ratio-21x9">
                  <LoadingSquare />
                </div>
              ) : (
                <div class="w-100">
                  {users.map((c) => (
                    <ItemRowUser c={c} />
    ))
}

{
  canLoadMoreUsers && (
    <button
                      className="btn btn-sm btn-link align-self-start"
                      onClick={() => {
                        fetchUsers();
                      }}
                    >
                      Load more
                    </button>
  )
} <
/div>
)
}
/>
)
}

{
  (isLoading || (clubs && clubs.length > 0)) && (
    <BoxCard
            className="mb-3"
            title="Clubs"
            content={
              !clubs || clubs.length === 0 ? (
                <div className="d-flex ratio ratio-21x9">
                  <LoadingSquare />
                </div>
              ) : (
                <div class="w-100">
                  {clubs.map((c) => (
                    <ItemRowClub c={c} />
  ))
}

{
  canLoadMoreClubs && (
    <button
                      className="btn btn-sm btn-link align-self-start"
                      onClick={() => {
                        fetchClubs();
                      }}
                    >
                      Load more
                    </button>
  )
} <
/div>
)
}
/>
)
}

{
  (isLoading || (players && players.length > 0)) && (
    <BoxCard
            className="mb-3"
            title="Players"
            content={
              !players || players.length === 0 ? (
                <div className="d-flex ratio ratio-21x9">
                  <LoadingSquare />
                </div>
              ) : (
                <div class="w-100">
                  {players.map((c) => (
                    <ItemRowPlayerAssist p={c} />
  ))
}

{
  canLoadMorePlayers && (
    <button
                      className="btn btn-sm btn-link align-self-start"
                      onClick={() => {
                        fetchPlayers();
                      }}
                    >
                      Load more
                    </button>
  )
} <
/div>
)
}
/>
)
}

{
  !isLoading &&
    clubs &&
    clubs.length === 0 &&
    players &&
    players.length === 0 &&
    users &&
    users.length === 0 && (
      <BoxCard
              contentClassName="py-5"
              content={<BoxMessage content={"No result found"} />
    }
  />
)
} <
/div> <
/div>
);
};

export default PageSearch;