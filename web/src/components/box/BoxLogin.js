import React from "react";
import { Link } from "react-router-dom";

interface BoxLoginProps {
  assistantUser?: object;
}

const BoxLogin: React.FC<BoxLoginProps> = ({ assistantUser }) => {
  return (
    <div className="card d-flex flex-column p-3 pt-2">
      <h4>Login required</h4>

      <div className="d-flex flex-column flex-md-row">
        <div className="d-flex flex-fill justify-content-center">
          <img
            style={{ width: "120px" }}
            src="/media/images/assistant.png"
            alt="MFL Assistant"
          />
        </div>

        <div className="d-flex flex-column flex-fill align-items-center justify-content-center px-2">
          <div className="pb-2">
            Connect your Dapper wallet
            <br />
            to access all the features.
          </div>

          <div>
            <button
              className="d-flex flex-row btn btn-info text-white me-1"
              disabled={typeof assistantUser === "undefined"}
            >
              {typeof assistantUser === "undefined"
                ? "Checking logging..."
                : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxLogin;
