import React from 'react';
import "./ButtonMflClub.css";

interface ButtonMflClubProps {
  clubId ? : int;
}

const ButtonMflClub: React.FC < ButtonMflClubProps > = ({ clubId }) => {

  return (
    <button
      className="btn background-mfl btn-xs text-black"
      onClick={() => window.open("https://app.playmfl.com/clubs/" + clubId, "_blank")}
    >
      MFL<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflClub;