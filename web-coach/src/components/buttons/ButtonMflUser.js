import React from 'react';
import "./ButtonMflUser.css";

interface ButtonMflUserProps {
  address ? : string;
}

const ButtonMflUser: React.FC < ButtonMflUserProps > = ({ address }) => {

  return (
    <button
      className="btn background-mfl btn-xs text-black"
      onClick={() => window.open("https://app.playmfl.com/users/" + address, "_blank")}
    >
      MFL<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflUser;