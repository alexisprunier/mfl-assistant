import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface ButtonMflAssistantUserProps {
  address ? : string;
}

const ButtonMflAssistantUser: React.FC < ButtonMflAssistantUserProps > = ({ address }) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-info btn-xs text-white"
      onClick={() => navigate("/user/" + address, "_blank")}
    >
      HQ<i className="bi bi-caret-right-fill"></i>
    </button>
  );
};

export default ButtonMflAssistantUser;