import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import MenuPageUser from "bars/MenuPageUser.js";
import { getUsers } from "services/api-assistant.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";

interface PageUserProps {
  yScrollPosition: number;
  props: object;
}

const PageUser: React.FC<PageUserProps> = (props) => {
  const navigate = useNavigate();

  const { address } = useParams();
  const [user, setUser] = useState(null);

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
      {props.yScrollPosition > 100 && <BoxScrollUp />}

      <div className="d-flex flex-column w-100 h-100">
        <div className="flex-grow-0">
          <MenuPageUser user={user} {...props} />
        </div>
        <div className="flex-grow-1">
          <Outlet context={user} />
        </div>
      </div>
    </div>
  );
};

export default PageUser;
