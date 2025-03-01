import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as fcl from "@onflow/fcl";
import { shortenHex } from "utils/address.js";

interface ButtonLoginProps {
  content: object;
  className?: string;
  flowUser?: object;
  assistantUser?: object;
  redirectToHq: boolean;
}

const ButtonLogin: React.FC<ButtonLoginProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logIn = () => {
    fcl.authenticate();
    if (props.redirectToHq) {
      navigate("/user/me");
    }
  };

  return (
    <Link
      className={
        props.className +
        (location.pathname.startsWith("/user/" + props.assistantUser?.address)
          ? " active"
          : "")
      }
      onClick={props.assistantUser ? undefined : logIn}
      to={
        props.assistantUser ? "/user/" + props.assistantUser.address : undefined
      }
    >
      <div className="px-1 py-md-2 px-md-0">
        {props.assistantUser ? (
          <div className="Menu-hq d-inline-block align-items-center text-center">
            <div className="text-center">
              <i className="bi bi-person-fill lh-1 px-1"></i>
              <div className="d-block w-100 lh-1">My HQ</div>
            </div>
          </div>
        ) : (
          props.content
        )}
      </div>
    </Link>
  );
};

export default ButtonLogin;
