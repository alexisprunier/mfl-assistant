import React from 'react';
import { Link } from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import { shortenHex } from "utils/address.js";

interface ButtonLoginProps {
  content: object;
  className ? : string;
  flowUser ? : object;
  assistantUser ? : object;
}

const ButtonLogin: React.FC < ButtonLoginProps > = (props) => {

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
    props.logout();
  };

  return (
    <Link
	    className={props.className}
	    onClick={props.assistantUser ? logOut : logIn}
	  >
	    <div className="px-1 py-md-2 px-md-0">
	      {props.assistantUser
	        ? <div
	          className="Menu-logout d-inline-block align-items-center text-center"
	          title="Logout"
	        >
	          <div className="text-center">
	            <i className="bi bi-person-fill lh-1 px-1"></i>
	            <div className="d-block w-100 lh-1">{shortenHex(props.assistantUser.address)}</div>
	          </div>
	        </div>
	        : props.content
	      }
	    </div>
	  </Link>
  );
};

export default ButtonLogin;