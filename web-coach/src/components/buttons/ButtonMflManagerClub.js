import React from 'react';

interface ButtonMflManagerClubProps {
  clubId ? : int;
}

const ButtonMflManagerClub: React.FC < ButtonMflManagerClubProps > = ({ clubId }) => {

  return (
    <button
      className="btn btn-info btn-xs text-white"
      onClick={() => window.open("https://mflmanager.fr/club.html?club=" + clubId, "_blank")}
    >
      MM<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflManagerClub;