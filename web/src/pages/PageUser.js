import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import LoadingSquare from "components/loading/LoadingSquare";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import { getPlayers, getUsers } from "services/api-assistant.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemRowClub from "components/items/ItemRowClub.js";
import ItemRowUser from "components/items/ItemRowUser.js";
import BoxMessage from "components/box/BoxMessage.js";
import { useParams } from 'react-router-dom';

interface PageUserProps {}

const PageUser: React.FC < PageUserProps > = () => {

  const { address } = useParams();
  const [user, setUser] = useState(null);

  const [players, setPlayers] = useState(null);
  const [playerPage, setPlayerPage] = useState(0);
  const [canLoadMorePlayers, setCanLoadMorePlayers] = useState(true);

  const fetchUser = () => {
    getUsers({
      handleSuccess: (d) => {
        if (d.data.getUsers && d.data.getUsers.length > 0) {
          setUser(d.data.getUsers[0]);
        }
      },
      handleError: (e) => console.log(e),
      params: { search: address },
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

        if (d.data.getPlayers.length < 500)
          setCanLoadMorePlayers(false);

        setPlayerPage(playerPage + 1)
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id], skip: playerPage * 500 },
    });
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user != null) {
      fetchPlayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div id="PageUser">
      <div className="container max-width-md px-4 py-5">

        {user && players !== null
          ? <div className="card d-flex mb-3 p-3 pt-2">
            <div className="d-flex flex-column">
              <div className="d-flex">
                <div className="h4 flex-grow-1">
                  User: {user.name}
                </div>
              </div>

              {players.map((c) => (
                <ItemRowPlayerAssist
                  p={c}
                />
              ))}
            </div>
          </div>
          : <LoadingSquare />
        }
      </div>
    </div>
  );
};

export default PageUser;