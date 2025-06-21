import BoxScrollUp from "components/box/BoxScrollUp.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers, getClubs } from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import BoxMessage from "components/box/BoxMessage.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import { getMatches } from "services/api-assistant.js";
import ItemRowMatch from "../components/items/ItemRowMatch";

interface PageUserProps {
  yScrollPosition: number;
  props: object;
}

const PageUser: React.FC<PageUserProps> = (props) => {
  const navigate = useNavigate();

  const { address } = useParams();
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState(null);
  const [matches, setMatches] = useState(null);

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
  };

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs);
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id] },
    });
  };

  const fetchMatches = () => {
    setMatches(null);

    getMatches({
      handleSuccess: (d) => {
        setMatches(d.data.getMatches);
      },
      handleError: (e) => console.log(e),
      params: {
        limit: 20,
        clubs: clubs.map((c) => c.id),
      },
    });
  };

  useEffect(() => {
    if (user) {
      fetchClubs();
    }
  }, [user]);

  useEffect(() => {
    if (clubs) {
      fetchMatches();
    }
  }, [clubs]);

  useEffect(() => {
    if (address !== "me") {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (address !== "me") {
      fetchUser();
    }
  }, [address]);

  useEffect(() => {
    if (address === "me" && props.assistantUser?.address) {
      navigate("/user/" + props.assistantUser.address);
    }
  }, [props.assistantUser]);

  return (
    <div id="PageUser" className="w-100 h-100">
      <nav className="TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-clipboard2-pulse-fill me-2"></i> My HQ
        </h3>
      </nav>

      <div className="d-flex w-100 h-100 justify-content-center">
        <div className="container-xl px-md-4 py-4">
          <div className="d-flex flex-column flex-md-row flex-fill">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard
                title={"HQ with Assistant"}
                content={
                  <div className="d-flex flex-column flex-fill">
                    <div className="text-center mt-1 mb-2">
                      <img
                        style={{
                          width: "60%",
                          maxWidth: "100%",
                        }}
                        src="/media/images/assistant.png"
                        alt="MFL Assistant"
                      />
                    </div>

                    <div className="text-end">
                      <button
                        className="btn btn-info text-white"
                        onClick={() =>
                          window.open(
                            "https://mfl-assistant.com/user/" +
                              props.assistantUser.address
                          )
                        }
                      >
                        Go to clubs, players, map...{" "}
                        <i class="bi bi-caret-right-fill text-white"></i>
                      </button>
                    </div>
                  </div>
                }
              />
            </div>
            <div className="d-flex flex-column flex-fill">
              <BoxCard
                title={"Matches"}
                content={
                  matches ? (
                    matches.length > 0 ? (
                      <div className="d-flex flex-column flex-fill">
                        {matches.map((m) => (
                          <ItemRowMatch match={m} />
                        ))}
                      </div>
                    ) : (
                      <BoxMessage
                        className={"py-4 py-md-0"}
                        content={"No match found"}
                      />
                    )
                  ) : (
                    <LoadingSquare height={300} />
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUser;
