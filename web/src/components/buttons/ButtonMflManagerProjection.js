import React from 'react';

interface ButtonMflManagerProjectionProps {
  name ? : string;
}

const ButtonMflManagerProjection: React.FC < ButtonMflManagerProjectionProps > = ({ name }) => {

  return (
    <button
      className="btn btn-info btn-xs text-white"
      onClick={() => window.open("https://mflmanager.fr/projections.html?div="+ name, "_blank")}
    >
      Projections<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflManagerProjection;