import BoxScrollUp from "components/box/BoxScrollUp.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "services/api-assistant.js";

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
      <div className="d-flex w-100 h-100 justify-content-center align-items-center">
        <div className="d-flex card mx-1 px-4 py-2">
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <i className="bi bi-cone-striped h4"></i>
              <br />
              Soon to come
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUser;
