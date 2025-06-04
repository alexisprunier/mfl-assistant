import React from "react";
import Popup from "reactjs-popup";

interface PopupInformationProps {
  className: String;
  title: Object;
  content: Object;
  trigger: Object;
}

const PopupInformation: React.FC<PopupInformationProps> = ({
  className,
  title,
  content,
  trigger,
}) => {
  return (
    <div className="PopupInformation">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        className={"fade-in popup-md " + className}
      >
        {(close) => (
          <div className="container bg-dark overflow-auto border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">{title}</h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="m-1 mb-3">{content}</div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupInformation;
