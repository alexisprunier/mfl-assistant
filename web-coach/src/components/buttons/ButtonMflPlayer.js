import React from 'react';
import "./ButtonMflPlayer.css";

interface ButtonMflPlayerProps {
  playerId ? : int;
}

const ButtonMflPlayer: React.FC < ButtonMflPlayerProps > = ({ playerId }) => {

  return (
    <button
      className="btn background-mfl btn-xs text-black"
      onClick={() => window.open("https://app.playmfl.com/players/" + playerId, "_blank")}
    >
      MFL<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflPlayer;