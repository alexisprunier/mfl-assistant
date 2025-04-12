import React from 'react';
import "./ButtonMflPlayer.css";

interface ButtonMflCompetitionProps {
  id ? : int;
}

const ButtonMflCompetition: React.FC < ButtonMflCompetitionProps > = ({ id }) => {

  return (
    <button
      className="btn background-mfl btn-xs text-black"
      onClick={() => window.open("https://app.playmfl.com/competitions/" + id, "_blank")}
    >
      MFL<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflCompetition;