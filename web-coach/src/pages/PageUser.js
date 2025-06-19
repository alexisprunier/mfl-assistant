import BoxScrollUp from "components/box/BoxScrollUp.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
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

  const fetchMatches = () => {
    setMatches(null);

    getMatches({
      handleSuccess: (d) => {
        setMatches(d.data.getMatches);
      },
      handleError: (e) => console.log(e),
      params: {
        limit: 20,
        //user: user.id,
      },
    });
  };

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

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
      <div className="d-flex w-100 h-100 justify-content-center">
        <div className="container-xl px-md-4 py-4">
          <div className="d-flex flex-column">
            <BoxCard
              title={"Matches"}
              content={
                matches ? (
                  <div className="d-flex flex-column flex-fill">
                    {matches.map((m) => (
                      <ItemRowMatch match={m} />
                    ))}
                  </div>
                ) : (
                  <LoadingSquare height={300} />
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUser;
